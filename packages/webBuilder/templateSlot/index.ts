import Moveable, { OnScale } from 'moveable';
import { singletonDController } from '../Layout/DOMController';
import { buildId } from '../uuid';
import { getDomObservable } from '../Layout/domSubscribe';
import { Chart } from './chart';
import { OperationLayer } from 'Layer/operationLayer';

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
  private matrix: number[];
  private dom?: HTMLElement;
  private moveable?: Moveable;
  constructor(info: IWidget) {
    this.nodeInfo = info;
    this.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    console.log(info, 'info-info');
    this.createWidget();
    getDomObservable().subscribe((v) => {
      if (v.type === 'set-dom-provider' && this.moveable) {
        console.log('cscscscscscscs');
        this.createMovable(v.value);
        this.drag();
        this.scale();
        this.resize();
        this.rotate();
        this.wrap();
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
      // If the container is null, the position is fixed. (default: parentElement(document.body))
      container: parentDom,
      className: 'adrag24-move-movable',
      draggable: true,
      resizable: true,
      scalable: true,
      rotatable: true,
      // Enabling pinchable lets you use events that
      // can be used in draggable, resizable, scalable, and rotateable.
      origin: false,
      keepRatio: false,
      // Resize, Scale Events at edges.
      edge: false,
      throttleDrag: 0,
      throttleResize: 0,
      throttleScale: 0,
      throttleRotate: 0,
    });
    console.log(this.moveable, 'movfsjgsgsg');
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

    //监听dom的变化,使dom隐藏时 其余钩子节点都隐藏

    //内容构建
    this.genChart();

    this.createMovable(singletonDController.getProviderDom() || document.body);
    this.drag();
    this.scale();
    this.resize();
    this.rotate();
    this.wrap();
    singletonDController.getProviderDom()?.appendChild(this.dom);
  }

  private genChart() {
    this.instance = new Chart();
  }

  protected wrap() {
    this.moveable
      ?.on('warpStart', ({ target, clientX, clientY }) => {
        // console.log('onWarpStart', target);
      })
      .on('warp', ({ target, clientX, clientY, delta, dist, multiply, transform }) => {
        //  console.log('onWarp', target);
        // target.style.transform = transform;
        this.matrix = multiply(this.matrix, delta);
        target.style.transform = `matrix3d(${this.matrix.join(',')})`;
      })
      .on('warpEnd', ({ target, isDrag, clientX, clientY }) => {
        //  console.log('onWarpEnd', target, isDrag);
      });
  }
  protected resize() {
    this.moveable
      ?.on('resizeStart', ({ target, clientX, clientY }) => {
        //  console.log('onResizeStart', target);
      })
      .on('resize', ({ target, drag, width, height, dist, delta, clientX, clientY }) => {
        //  console.log('onResize', target);
        // delta[0] && (target!.style.width = `${width}px`);
        // delta[1] && (target!.style.height = `${height}px`);
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
        target.style.transform = drag.transform;
      })
      .on('resizeEnd', ({ target, isDrag, clientX, clientY }) => {
        //  console.log('onResizeEnd', target, isDrag);
      });
  }
  protected drag() {
    this.moveable
      ?.on('dragStart', ({ target, clientX, clientY }) => {
        //  console.log('onDragStart', target);
      })
      .on(
        'drag',
        ({
          target,
          transform,
          left,
          top,
          right,
          bottom,
          beforeDelta,
          beforeDist,
          delta,
          dist,
          clientX,
          clientY,
        }) => {
          // console.log('onDrag left, top', left, top);
          target!.style.left = `${left}px`;
          target!.style.top = `${top}px`;
          // console.log("onDrag translate", dist);
          // target!.style.transform = transform;
        }
      )
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
  protected scale() {
    this.moveable
      ?.on('scaleStart', ({ target, clientX, clientY }) => {
        //  console.log('onScaleStart', target);
      })
      .on('scale', ({ target, scale, dist, delta, transform, clientX, clientY }: OnScale) => {
        // console.log('onScale scale', scale);
        target!.style.transform = transform;
      })
      .on('scaleEnd', ({ target, isDrag, clientX, clientY }) => {
        //console.log('onScaleEnd', target, isDrag);
      });
  }
}
