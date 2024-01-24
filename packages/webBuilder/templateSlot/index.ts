import Moveable, { OnScale } from 'moveable';
import { singletonDController } from '../Layout/DOMController';
import { getDomObservable } from '../Layout/domSubscribe';
import { Chart } from './chart';

import dayjs from 'dayjs';
import { getSelectionObservable } from '../Slot/selection';

export interface IWidget {
  id: string;
  type: IWidgetType;
  pageY: number;
  pageX: number;
  pointX: number;
  pointY: number;
  width: number;
  height: number;
}
export type IWidgetType = 'chart' | 'table' | 'text' | 'image';
export class TemplateNode {
  private nodeInfo: IWidget;
  private instance?: Chart;
  private observer?: MutationObserver;
  private dom?: HTMLElement;
  private moveable?: Moveable;
  constructor(info: IWidget) {
    this.nodeInfo = info;
    console.log(info, this.moveable?.getManager(), 'info-info');
    this.createWidget();
    getDomObservable().subscribe((v) => {
      if (v.type === 'set-dom-provider' && this.moveable) {
        console.log('cscscscscscscs');
        this.createMovable(v.value);
        this.drag();
        this.click();
        this.resize();
        this.rotate();
      }
    });
  }

  public getCurrentRect() {
    return this.moveable?.getRect();
  }

  public getId() {
    return this.nodeInfo.id;
  }

  public getInfo() {
    return this.nodeInfo;
  }

  public getNode() {
    return this.dom;
  }

  protected createMovable(parentDom: HTMLElement) {
    this.moveable?.destroy();
    this.moveable = new Moveable(parentDom, {
      target: this.dom,
      container: parentDom,
      className: this.nodeInfo.id,
      draggable: true,
      resizable: true,
      origin: false,
      rotatable: true,
      throttleDrag: 0,
      throttleResize: 0,
      throttleScale: 0,
      throttleRotate: 0,
    });
    console.log(this.moveable.getControlBoxElement(), 'movfsjgsgsg');
  }
  protected createWidget() {
    console.log(singletonDController, 'singletonDController');
    this.dom = singletonDController.addDomRetEle();
    if (!this.dom) {
      return;
    }
    this.dom.id = this.nodeInfo.id;
    this.dom.style.position = 'absolute';
    this.dom.style.zIndex = '10';
    this.dom.className = 'adrag24-move-movable';
    this.dom.style.width = this.nodeInfo.width + 'px';
    this.dom.style.height = this.nodeInfo.height + 'px';
    this.dom.style.left = this.nodeInfo.pointX + 'px';
    this.dom.style.top = this.nodeInfo.pointY + 'px';
    this.dom.style.background = 'red';
    this.dom.setAttribute('data-isNode', '1');
    //监听dom的变化,使dom隐藏时 其余钩子节点都隐藏
    this.mutationDom();

    //内容构建
    this.genChart();

    this.createMovable(singletonDController.getProviderDom() || document.body);
    this.drag();
    this.click();
    this.resize();
    this.rotate();
    singletonDController.getProviderDom()?.appendChild(this.dom);
  }
  public click() {
    this.moveable?.on('click', (params) => {
      getSelectionObservable().next({
        type: 'click',
        time: dayjs(),
        value: params,
      });
    });
  }
  private mutationDom() {
    const config = { attributes: true, childList: true, subtree: true };
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.observer = new MutationObserver(function (mutationsList, observer) {
      // Use traditional 'for loops' for IE 11
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          if (mutation.target instanceof HTMLElement) {
            if (mutation.target.style.display === 'none') {
              that.blur();
            } else {
              that.focus();
            }
          }
        }
      }
    });
    this.dom && this.observer.observe(this.dom, config);
  }

  private genChart() {
    this.instance = new Chart();
  }

  protected resize() {
    this.moveable
      ?.on('resizeStart', ({ target, clientX, clientY }) => {
        console.log('onResizeStart', target);
      })
      .on('resize', ({ target, drag, width, height, dist, delta, clientX, clientY }) => {
        console.log('onResizeStartdrag', drag);
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
        target.style.transform = drag.transform;
      })
      .on('resizeEnd', ({ target, isDrag, clientX, clientY }) => {
        //  console.log('onResizeEnd', target, isDrag);
      });
  }

  /**
   * 设置位置
   *
   * @param   {number}  left   [left description]
   * @param   {number}  top    [top description]
   *
   * @return  {[type]}         [return description]
   */

  private update() {
    this.moveable?.updateRect();
    this.moveable?.forceUpdate();
  }
  public getMovable() {
    return this.moveable;
  }

  public focus() {
    if (!this.moveable) {
      return;
    }
    this.moveable.getControlBoxElement().style.display = 'block';
    this.moveable.getControlBoxElement().style.visibility = 'visible';
    this.moveable.forceUpdate();
  }

  public blur() {
    if (!this.moveable) {
      return;
    }
    this.moveable.getControlBoxElement().style.display = 'none';
    this.moveable.getControlBoxElement().style.visibility = 'hidden';
    this.moveable.forceUpdate();
  }

  protected drag() {
    let offsetLeft = 0;
    let offsetTop = 0;
    this.moveable
      ?.on('dragStart', (params) => {
        //
        offsetLeft = params.moveable.getRect().left;
        offsetTop = params.moveable.getRect().top;
        getSelectionObservable().next({
          type: 'select',
          time: dayjs(),
          value: this,
        });
      })
      .on('drag', ({ target, left, top }) => {
        target!.style.left = `${left}px`;
        target!.style.top = `${top}px`;
        getSelectionObservable().next({
          type: 'selection-move',
          time: dayjs(),
          value: {
            left: left - offsetLeft,
            top: top - offsetTop,
          },
        });
      })
      .on('dragEnd', ({ target, isDrag, clientX, clientY }) => {
        // console.log('onDragEnd', target, isDrag);
        getSelectionObservable().next({
          type: 'selection-over',
          time: dayjs(),
          value: this,
        });
      });
  }
  protected rotate() {
    this.moveable
      ?.on('rotateStart', ({ target, clientX, clientY }) => {
        //  console.log('onRotateStart', target);
      })
      .on('rotate', ({ target, beforeDelta, delta, dist, transform, clientX, clientY }) => {
        //  console.log('onRotate', dist);
        target!.style.transform = transform;
      })
      .on('rotateEnd', ({ target, isDrag, clientX, clientY }) => {
        //  console.log('onRotateEnd', target, isDrag);
      });
  }
}
