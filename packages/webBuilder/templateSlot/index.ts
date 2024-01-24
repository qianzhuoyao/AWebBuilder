import Moveable from 'moveable';
import { singletonDController } from '../Layout/DOMController';
import { getDomObservable } from '../Layout/domSubscribe';
import { Chart } from './chart';

import { OperationLayer } from 'Layer/operationLayer';

export interface IWidget {
  id: string;
  layer: OperationLayer;
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
    this.createWidget();
    getDomObservable().subscribe((v) => {
      if (v.type === 'set-dom-provider' && this.moveable) {
        this.createMovable(v.value);
      }
    });
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
    this.drag();
    this.resize();
    this.rotate();
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

    singletonDController.getProviderDom()?.appendChild(this.dom);
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
              //
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

  public getMovable() {
    return this.moveable;
  }

  protected drag() {
    this.moveable
      ?.on('dragStart', (params) => {
        //
      })
      .on('drag', ({ target, left, top }) => {
        target!.style.left = `${left}px`;
        target!.style.top = `${top}px`;
      })
      .on('dragEnd', ({ target, isDrag, clientX, clientY }) => {
        // console.log('onDragEnd', target, isDrag);
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
