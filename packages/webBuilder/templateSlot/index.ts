import Moveable from 'moveable';
import { singletonDController } from '../Layout/DOMController';
import { getDomObservable } from '../Layout/domSubscribe';
import { Chart } from './chart';

import { OperationLayer } from '../Layer/operationLayer';
import { getBothMoveObservable } from '../Slot/selection';
import { mouseUp } from '../eventStream/keyEvent';
import { LAYOUT_CHANGE, getPanelSendObservable } from '../Layout/subscribePanel';

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
  //原始值
  private nodeInfo: IWidget;
  private instance?: Chart;
  private observer?: MutationObserver;
  private dom?: HTMLElement;
  private bothMoveTag = false;
  private bothMovePositionMemo?: {
    id: string;
    left: number;
    top: number;
  };
  private moveable?: Moveable;
  constructor(info: IWidget) {
    this.nodeInfo = info;
    this.createWidget();

    //监听面板当前layer
    getPanelSendObservable().subscribe((v) => {
      if (v.type === LAYOUT_CHANGE) {
        //显示隐藏当前widget
        if (v.value.id !== this.nodeInfo.layer.id) {
          this.boxHidden();
          this.domHidden();
        } else {
          this.boxVisible();
          this.domVisible();
        }
      }
    });

    mouseUp(
      (e) => {
        if (this.bothMoveTag) {
          this.bothMoveTag = false;
          this.bothMovePositionMemo = undefined;
          this.boxHidden();
        }
      },
      {
        first: true,
        repeat: true,
      }
    );

    getBothMoveObservable().subscribe((v) => {
      if (v.type === 'SIGNAL') {
        if (v.bothId.includes(this.getId())) {
          //开始标记移动准备
          this.bothMoveTag = true;
          this.bothMovePositionMemo = v.syncPosition.filter(
            (info) => info.id === this.nodeInfo.id
          )[0];
        }
      } else if (v.type === 'MOVE') {
        if (v.id !== this.getId() && this.bothMoveTag) {
          if (!this.dom) {
            return;
          }
          this.dom.style.left = (this.bothMovePositionMemo?.left || 0) + v.left + 'px';
          this.dom.style.top = (this.bothMovePositionMemo?.top || 0) + v.top + 'px';

          // this.moveable?.request(
          //   'draggable',
          //   {
          //     x: (this.bothMovePositionMemo?.left || 0) + v.left,
          //     y: (this.bothMovePositionMemo?.top || 0) + v.top,
          //   },
          //   true
          // );
          this.moveable?.updateRect();
        }
      }
    });
    getDomObservable().subscribe((v) => {
      if (v.type === 'set-dom-provider' && this.moveable) {
        this.createMovable(v.value);
      }
    });
  }

  private domHidden() {
    if (!this.dom) {
      return;
    }
    this.dom.style.display = 'none';
  }
  private domVisible() {
    if (!this.dom) {
      return;
    }
    this.dom.style.display = 'block';
  }
  private boxVisible() {
    const box = this.getMovable()?.getControlBoxElement();
    if (!box) {
      return;
    }
    box.style.visibility = 'visible';
  }

  private boxHidden() {
    const box = this.getMovable()?.getControlBoxElement();
    if (!box) {
      return;
    }
    box.style.visibility = 'hidden';
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
    this.dom.setAttribute('data-A', String(this.nodeInfo.pointX));
    this.dom.setAttribute('data-B', String(this.nodeInfo.pointY));
    //监听dom的变化,使dom隐藏时 其余钩子节点都隐藏
    this.mutationDom();

    //内容构建
    this.genChart();

    this.createMovable(singletonDController.getProviderDom() || document.body);

    singletonDController.getProviderDom()?.appendChild(this.dom);
  }

  private mutationDom() {
    const config = { attributes: true, childList: true, subtree: true };
    this.observer = new MutationObserver((mutationsList, observer) => {
      // Use traditional 'for loops' for IE 11
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          if (mutation.target instanceof HTMLElement) {
            if (mutation.target.style.display === 'none') {
              //
              if (this.moveable?.getControlBoxElement()) {
                this.moveable.getControlBoxElement().style.display = 'none';
              }
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
        //
      })
      .on('resize', ({ target, drag, width, height, dist, delta, clientX, clientY }) => {
        //
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
    let offsetX = 0;
    let offsetY = 0;
    this.moveable
      ?.on('dragStart', (params) => {
        //
        if (this.bothMoveTag) {
          offsetX = this.moveable?.getRect().left || 0;
          offsetY = this.moveable?.getRect().top || 0;
        }
      })
      .on('drag', ({ target, left, top }) => {
        target!.style.left = `${left}px`;
        target!.style.top = `${top}px`;
        if (this.bothMoveTag) {
          getBothMoveObservable().next({
            type: 'MOVE',
            id: this.getId(),
            left: left - offsetX,
            top: top - offsetY,
          });
        }
      })
      .on('dragEnd', ({ target, isDrag, clientX, clientY }) => {
        // console.log('onDragEnd', target, isDrag);
        this.dom?.setAttribute('data-A', String(this.moveable?.getRect().left));
        this.dom?.setAttribute('data-B', String(this.moveable?.getRect().top));
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
