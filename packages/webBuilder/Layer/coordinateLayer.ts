import { singletonDController } from '../Layout/DOMController';
import { ICoordinateSystem } from '../Layout/coordinateSystem';
import { ISize } from '../Layout/panel';
import { Layer } from './Layer';
import { fabric } from 'fabric';
import { getCoordinateObservable } from './coordinateLayerSubscribe';
import dayjs from 'dayjs';
import { keyDown, keyUp } from '../eventStream/keyEvent';
import { mergeTaskPipe } from '../Queue/mergeTaskPipe';
import { repeat, skipUntil, takeUntil, takeWhile, withLatestFrom } from 'rxjs';
import {
  SCALE_COORDINATOR_TRIGGER,
  TRANSFORM_END_TRIGGER,
  TRANSFORM_MOVING_TRIGGER,
  TRANSFORM_START_TRIGGER,
  getPanelAcceptObservable,
} from '../Layout/subscribePanel';

export class CoordinateLayer extends Layer {
  // private tickFontFamily = 'Calibri';

  private canZoom = true;
  private canTransform = true;
  private fCanvas: any = null;
  private tickCoordinate: ICoordinateSystem | null = null;
  // private tickObj: any = [];
  private gridObj: any = [];
  // private tickFontColor = '#000';
  // private tickFontSize = 10;
  constructor(Size: ISize, unitSize: number) {
    super(Size, unitSize);
    //注册默认的放大缩小事件
    this.zoomIn();
    this.zoomOut();
    //默认注册一个移动事件
    this.transform();
    //默认设置一个图层dom
    const newLayer = singletonDController.addCanvasRetCanvas();
    if (!newLayer) {
      return;
    }
    // newLayer.id = this.layerDom.id;
    this.setLayerDom(newLayer);
  }

  public setCanZoom(state: boolean) {
    this.canZoom = state;
  }

  public getFCanvasZoom() {
    this.fCanvas?.getZoom();
  }

  public getTickCoordinate() {
    return this.tickCoordinate;
  }

  protected fCanvasEvent(fCanvas: any) {
    fCanvas.on('mouse:down', (options: any) => {
      getCoordinateObservable().next(() => {
        return new Promise((res) => {
          res({
            time: dayjs(),
            type: 'fCanvas-mouse-down',
            options,
          });
        });
      });
    });
    fCanvas.on('mouse:move', (options: any) => {
      getCoordinateObservable().next(() => {
        return new Promise((res) => {
          res({
            time: dayjs(),
            type: 'fCanvas-mouse-move',
            options,
          });
        });
      });
    });
    fCanvas.on('mouse:up', (options: any) => {
      getCoordinateObservable().next(() => {
        return new Promise((res) => {
          res({
            time: dayjs(),
            type: 'fCanvas-mouse-up',
            options,
          });
        });
      });
    });
    fCanvas.on('mouse:wheel', (options: any) => {
      getCoordinateObservable().next(() => {
        return new Promise((res) => {
          res({
            time: dayjs(),
            type: 'fCanvas-mouse-wheel',
            options,
          });
        });
      });
    });
  }

  /**
   * 设置scale 覆盖值
   *
   * @param   {number}  scale    [scale description]
   * @param   {number}  offsetX  [offsetX description]
   * @param   {number}  offsetY  [offsetY description]
   *
   * @return  {[type]}           [return description]
   */
  public setScale(scale: number, offsetX: number, offsetY: number) {
    this.fCanvas?.zoomToPoint(
      {
        // 关键点
        x: offsetX,
        y: offsetY,
      },
      scale // 传入修改后的缩放级别
    );
    getPanelAcceptObservable().next({
      type: SCALE_COORDINATOR_TRIGGER,
      time: dayjs(),
      value: scale,
    });
  }
  /**
   * 缩放设置 渐变
   *
   * @param   {number}  val      [val description]
   * @param   {number}  offsetX  [offsetX description]
   * @param   {number}  offsetY  [offsetY description]
   *
   * @return  {[type]}           [return description]
   */
  private setZoom(val: number, offsetX: number, offsetY: number) {
    let zoom = this.fCanvas?.getZoom(); // 获取画布当前缩放级别
    zoom += val;
    if (zoom > 20) zoom = 20; // 限制最大缩放级别
    if (zoom < 0.01) zoom = 0.01; // 限制最小缩放级别
    this.fCanvas?.zoomToPoint(
      {
        // 关键点
        x: offsetX,
        y: offsetY,
      },
      zoom // 传入修改后的缩放级别
    );

    getPanelAcceptObservable().next({
      type: SCALE_COORDINATOR_TRIGGER,
      time: dayjs(),
      value: zoom,
    });
  }

  /**
   * 鼠标 与 键M
   * 可以移动坐标系中心值
   *
   * @return  {[type]}  [return description]
   */
  private transform() {
    getCoordinateObservable()
      .pipe(
        mergeTaskPipe(1),
        takeWhile(() => this.canTransform),
        skipUntil(keyDown().observable),
        takeUntil(keyUp().observable),
        withLatestFrom(keyDown().observable),
        takeWhile(([a, b]) => {
          a.options.e.preventDefault();
          return b.code === 'KeyM';
        }),
        repeat()
      )
      .subscribe(([v]) => {
        if (['fCanvas-mouse-up', 'fCanvas-mouse-down', 'fCanvas-mouse-move'].includes(v.type)) {
          const evt = v.options.e;

          if (v.type === 'fCanvas-mouse-down') {
            this.fCanvas.isDragging = true;
            this.fCanvas.lastPosX = evt.clientX;
            this.fCanvas.lastPosY = evt.clientY;
            getPanelAcceptObservable().next({
              type: TRANSFORM_START_TRIGGER,
              time: dayjs(),
              value: {
                lastPosX: evt.clientX,
                lastPosY: evt.clientY,
                vpt: this.fCanvas.viewportTransform,
              },
            });
          } else if (v.type === 'fCanvas-mouse-move') {
            if (this.fCanvas.isDragging) {
              this.fCanvas.selection = false;
              const vpt = this.fCanvas.viewportTransform;
              vpt[4] += evt.clientX - this.fCanvas.lastPosX;
              vpt[5] += evt.clientY - this.fCanvas.lastPosY;
              this.fCanvas.requestRenderAll();
              this.fCanvas.lastPosX = evt.clientX;
              this.fCanvas.lastPosY = evt.clientY;
              this.fCanvas.requestRenderAll();
              getPanelAcceptObservable().next({
                type: TRANSFORM_MOVING_TRIGGER,
                time: dayjs(),
                value: {
                  lastPosX: evt.clientX,
                  lastPosY: evt.clientY,
                  vpt,
                },
              });
            }
          } else {
            this.fCanvas.setViewportTransform(this.fCanvas.viewportTransform);
            this.fCanvas.isDragging = false;
            this.fCanvas.selection = true;
            getPanelAcceptObservable().next({
              type: TRANSFORM_END_TRIGGER,
              time: dayjs(),
              value: undefined,
            });
          }
        }
      });
  }

  /**
   * 鼠标绑定个放大缩小事件
   *
   * @return  {[type]}  [return description]
   */
  private zoomOut() {
    getCoordinateObservable()
      .pipe(
        mergeTaskPipe(1),
        takeWhile(() => this.canZoom),
        skipUntil(keyDown().observable),
        takeUntil(keyUp().observable),
        withLatestFrom(keyDown().observable),
        takeWhile(([a, b]) => {
          a.options.e.preventDefault();
          return b.code === 'KeyF';
        }),
        repeat()
      )
      .subscribe(([v]) => {
        const delta = v.options.e.deltaY;
        if (delta < 0 && v.type === 'fCanvas-mouse-wheel') {
          this.setZoom(0.05, v.options.e.offsetX, v.options.e.offsetY);
        }
      });
  }
  /**
   * 鼠标绑定个放大缩小事件
   * 默认 绑定在F 键上
   *
   * @return  {[type]}  [return description]
   */
  private zoomIn() {
    getCoordinateObservable()
      .pipe(
        mergeTaskPipe(1),
        takeWhile(() => this.canZoom),
        skipUntil(keyDown().observable),
        takeUntil(keyUp().observable),
        withLatestFrom(keyDown().observable),
        takeWhile(([a, b]) => {
          a.options.e.preventDefault();
          return b.code === 'KeyF';
        }),
        repeat()
      )
      .subscribe(([v]) => {
        const delta = v.options.e.deltaY;
        if (delta > 0 && v.type === 'fCanvas-mouse-wheel') {
          this.setZoom(-0.05, v.options.e.offsetX, v.options.e.offsetY);
        }
      });
  }

  public fClear() {
    this.fCanvas?.clear();
  }

  /**
   * 更新挂载
   *
   *
   * @param   {HTMLElement}  dom  [dom description]
   *
   * @return  {[type]}            [return description]
   */
  public setCanvasParentDom(dom: HTMLElement) {
    this.layerDom && dom.appendChild(this.layerDom);
    dom.appendChild(this.fCanvas.wrapperEl);
    this.fCanvas.wrapperEl.style.zIndex = 10;
    dom.style.position = 'relative';

    this.newProvider = dom;
  }

  /**
   * 绘制网格
   * 默认再layerDom上追加canvas
   * @return  {[type]}  [return description]
   */
  public drawGrid(coordinate: ICoordinateSystem, tickSize: number) {
    //canvas 在最下面
    this.layerDom && this.newProvider?.appendChild(this.layerDom);
    if (this.layerDom instanceof HTMLCanvasElement) {
      this.layerDom.width = this.width;
      this.layerDom.height = this.height;
      this.splitDrawGrid(this.layerDom, coordinate, tickSize);
    }
  }

  /**
   * 刻度偏移
   *
   * @param   {ICoordinateSystem}  coordinate  [coordinate description]
   *
   * 默认偏移40px 同unitSize
   *
   * @return  {[type]}                         [return description]
   */
  private setTick(coordinate: ICoordinateSystem, tickSize: number): ICoordinateSystem {
    return {
      x: coordinate.x.map((value) => value + tickSize),
      y: coordinate.y.map((value) => value + tickSize),
    };
  }

  public disposeFCanvas() {
    this.fCanvas?.dispose();
  }
  /**
 * 重新绘制网格
   刻度线
 *
 * @param   {HTMLCanvasElement}  canvas      [canvas description]
 * @param   {ICoordinateSystem}  coordinate  [coordinate description]
 * @param   {number}             tickSize    [tickSize description] 留给刻度线的位置
 *
 * @return  {[type]}                         [return description]
 */
  public splitDrawGrid(canvas: HTMLCanvasElement, coordinate: ICoordinateSystem, tickSize: number) {
    const lineStroke = '#C5C9CB';
    //重置操作
    if (!this.fCanvas) {
      this.fCanvas = new fabric.Canvas(canvas.id, {
        allowTouchScrolling: true,
      });
      //给fCanvas增加事件
      this.fCanvasEvent(this.fCanvas);
    }
    this.fCanvas.setWidth(this.width);
    this.fCanvas.setHeight(this.height);
    //计算包含刻度内的冗余位置
    this.tickCoordinate = this.setTick(coordinate, tickSize);
    // this.tickObj.map((to: any) => {
    //   this.fCanvas.remove(to);
    // });
    // this.tickObj = [];
    this.gridObj.map((go: any) => {
      this.fCanvas.remove(go);
    });
    this.gridObj = [];
    this.tickCoordinate.x.map((c) => {
      //最后一项不要 溢出 保留溢出
      if (c >= this.width) {
        return;
      }
      const lineX = new fabric.Line([c, tickSize, c, this.height - tickSize], {
        stroke: lineStroke,
        selectable: false,
        type: 'line',
        centeredScaling: true,
      });

      this.fCanvas.add(lineX);
      // this.fCanvas.add(textXTickMark);
      // this.tickObj.push(textXTickMark);
      this.gridObj.push(lineX);
    });
    this.tickCoordinate.y.map((c) => {
      //最后一项不要 溢出

      if (c >= this.height) {
        return;
      }

      const lineY = new fabric.Line([tickSize, c, this.width - tickSize, c], {
        stroke: lineStroke,
        selectable: false,
        type: 'line',
        centeredScaling: true,
      });
      // this.fCanvas.add(textYTickMark);
      this.fCanvas.add(lineY);
      // this.tickObj.push(textYTickMark);
      this.gridObj.push(lineY);
    });
  }
}
