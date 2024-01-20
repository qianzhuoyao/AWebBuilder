import { Layer } from '../Layer/Layer';
import {
  ICoordinateSystem,
  ICoordinateSystemParams,
  generateCoordinateSystem,
} from './coordinateSystem';
import { CoordinateLayer } from '../Layer/coordinateLayer';
import { getAdjust, removeAdjust } from '../renderStream/adjust';
import { mergeTaskPipe } from '../Queue/mergeTaskPipe';
import {
  ALIGN_TRIGGER,
  BACKUP_COORDINATOR_TRIGGER,
  removePanelAcceptObservable,
  removePanelSendObservable,
  getPanelAcceptObservable,
  getPanelSendObservable,
  SCALE_COORDINATOR_TRIGGER,
  LOADING_TRIGGER,
  TRANSFORM_END_TRIGGER,
  TRANSFORM_MOVING_TRIGGER,
  TRANSFORM_START_TRIGGER,
  ITransformValue,
} from './subscribePanel';
import dayjs from 'dayjs';
import { removeLayerObservable } from '../Layer/layerSubscribe';
import { IUiTheme } from './theme';
import {
  IFcanvasRes,
  getCoordinateObservable,
  removeCoordinateObservable,
} from '../Layer/coordinateLayerSubscribe';
import { keyDown, keyUp } from '../eventStream/keyEvent';
import { singletonDController } from './DOMController';

/**
 * 面板
 *
 * 注意：
 * unitSize 不允许修正
 */

interface IPanelConstructor {
  coordinateSystemConfig: ICoordinateSystemParams;
}

export type ISize = Omit<ICoordinateSystemParams, 'unitSize'>;

export class Panel {
  private uiTheme: IUiTheme;
  private loading = false;
  private coordinatorConfig: ICoordinateSystemParams;
  private coordinator: ICoordinateSystem;
  private layer: Layer[] = [];
  private coordinateSystemLayer: CoordinateLayer;

  /**
   * 缩放比例
   *
   * @var {[type]}
   */
  private scale = 1;
  /**
   * [alignGrid description]
   *just-vertex 顶点对齐 对长宽忽略
    strict-vertex 四个顶点都要对其
    none 不对齐
   * @var {[type]}
   */
  private alignGrid: 'just-vertex' | 'strict-vertex' | 'none';

  /**
   * 长宽比例设置
   *
   * @param   {[type]}             width   [width description]
   * @param   {IPanelConstructor}  height  [height description]
   *
   * @return  {[type]}                     [return description]
   */
  constructor({ coordinateSystemConfig }: IPanelConstructor) {
    //默认操作对齐网格方式just-vertex
    this.alignGrid = 'just-vertex';
    this.coordinatorConfig = coordinateSystemConfig;
    this.coordinator = generateCoordinateSystem(coordinateSystemConfig);
    console.log(this.coordinator, 'this.coordinator');
    //计算完坐标后发送副本至所有的slot
    getPanelSendObservable().next({
      type: BACKUP_COORDINATOR_TRIGGER,
      time: dayjs(),
      value: this.coordinator,
    });

    this.coordinateSystemLayer = this.setCoordinateSystemLayer({
      width: coordinateSystemConfig.width,
      height: coordinateSystemConfig.height,
    });
    this.coordinateSystemLayer.drawGrid(this.coordinator, this.coordinatorConfig.unitSize);
    //注册下对齐的调整流,初始进入不执行修正流，执行初次渲染的修正
    this.initAlignGridStream();
    //默认dim背景
    this.uiTheme = 'light';
    this.setTheme(this.uiTheme);
    //接收所有发送给panel的信息
    this.mapDataWithPanelAccept();
  }

  /**
   * 按下事件
   *
   * @param   {KeyboardEvent}  callback  [callback description]
   *
   * @return  {[type]}                   [return description]
   */
  public onKeyDown(callback: (e: KeyboardEvent) => void) {
    keyDown(callback, {
      first: true,
      repeat: true,
    });
  }

  /**
   * 抬起事件
   *
   * @param   {KeyboardEvent}  callback  [callback description]
   *
   * @return  {[type]}                   [return description]
   */
  public onKeyUp(callback: (e: KeyboardEvent) => void) {
    keyUp(callback, {
      first: true,
      repeat: true,
    });
  }

  /**
   * 面板下所有的缩放
   *
   * @return  {[type]}  [return description]
   */
  public getScale() {
    return this.scale;
  }

  /**
   * 设置缩放
   *
   * @return  {[type]}  [return description]
   */
  public setScale(scale: number) {
    this.scale = scale;
    this.coordinateSystemLayer.setScale(scale, 0, 0);
  }

  /**
   * 处理接收到的广播信息
   *
   * @return  {[type]}  [return description]
   */
  private mapDataWithPanelAccept() {
    this.onSubscribeScale();
    this.onSubscribeLoading();
    this.onSubscribeCSTransform({});
  }

  /**
   * 处理来自坐标系的偏移操作
   *
   * @return  {[type]}  [return description]
   */
  public onSubscribeCSTransform(callbacks: {
    start?: (v: ITransformValue) => void;
    moving?: (v: ITransformValue) => void;
    end?: () => void;
  }) {
    getPanelAcceptObservable().subscribe((v) => {
      if (v.type === TRANSFORM_START_TRIGGER) {
        console.log(v.value, 'v-0-a');
        //开始
        callbacks.start && callbacks.start(v.value);
      } else if (v.type === TRANSFORM_MOVING_TRIGGER) {
        console.log(v.value, 'v-0-a01');
        callbacks.moving && callbacks.moving(v.value);
        //ing
      } else if (v.type === TRANSFORM_END_TRIGGER) {
        //end
        callbacks.end && callbacks.end();
      }
    });
  }
  /**
   * 获取loading
   *
   * @return  {[type]}  [return description]
   */
  public getLoading() {
    return this.loading;
  }

  /**
   * 设置loading
   *
   * @param   {boolean}  state  [state description]
   *
   * @return  {[type]}          [return description]
   */
  public setLoading(state: boolean) {
    getPanelAcceptObservable().next({
      type: LOADING_TRIGGER,
      time: dayjs(),
      value: state,
    });
  }

  /**
   * 处理加载
   *
   * @return  {[type]}  [return description]
   */
  public onSubscribeLoading(callback?: (loading: boolean) => void) {
    getPanelAcceptObservable().subscribe((v) => {
      if (v.type === LOADING_TRIGGER) {
        //加载效果
        this.loading = v.value;
        callback && callback(v.value);
      }
    });
  }

  /**
   * 更改主题状态
   * 但是ui改变需要daisyui
   *
   * @return  {[type]}  [return description]
   */
  public setTheme(theme: IUiTheme) {
    const html = document.getElementsByTagName('html');
    for (let index = 0; index < html.length; index++) {
      html[index].setAttribute('data-theme', theme);
      if (theme === 'dark' || theme === 'night') {
        this.coordinateSystemLayer.drawGrid(this.coordinator, this.coordinatorConfig.unitSize);
      }
    }
  }

  /**
   * 获取切分刻度
   *
   * @return  {[type]}  [return description]
   */
  public getCoordinateSystemLayerTick() {
    return this.coordinateSystemLayer.getTickCoordinate();
  }

  /**
   *     获取缩放比例
   *  以coordinateSystemLayer为准
   *
   * @return  {[type]}  [return description]
   */
  public getFCanvasScale() {
    return this.coordinateSystemLayer.getFCanvasZoom();
  }

  public onSubscribeScale(callback?: (scale: number) => void) {
    getPanelAcceptObservable().subscribe((v) => {
      console.log(v, 'getPanelAcceptObservable');
      if (v.type === SCALE_COORDINATOR_TRIGGER) {
        this.scale = v.value;
        callback && callback(v.value);
        //接收到来自坐标系的缩放信号后，同步缩放
      }
    });
  }
  /**
   * 调整流
   * 只针对 alginGrid变更下的Slot位置调整
   *
   * @return  {[type]}  [return description]
   */
  protected initAlignGridStream() {
    getAdjust()
      //允许并行10个修正任务
      .pipe(mergeTaskPipe(10))
      .subscribe((slot) => {
        //重新绘制slot位置
        //避免slot更新
        console.log(slot);
      });
  }

  /**
   * 来自坐标系的事件
   *
   * @return  {[type]}  [return description]
   */
  public onCoordinateSystemLayerEvent(callback: (e: IFcanvasRes) => void) {
    getCoordinateObservable()
      .pipe(mergeTaskPipe(10))
      .subscribe((v) => {
        callback(v);
      });
    // this.coordinateSystemLayer.selection();
  }
  /**
   * 设置对齐方式
   * 他同步更新所有的节点
   *
   * @param   {[type]}  alignType      [alignType description]
   *just-vertex 顶点对齐 对长宽忽略
   *strict-vertex 四个顶点都要对其
   *none 不对齐
   * @return  {[type]}                      [return description]
   */
  public setAlignGrid(alignType: 'just-vertex' | 'strict-vertex' | 'none') {
    this.alignGrid = alignType;
    //通知slot 主动修正位置
    getPanelSendObservable().next({
      type: ALIGN_TRIGGER,
      time: dayjs(),
      value: alignType,
    });
  }

  /**
   * 获取对齐方式
   *
   * @return  {[type]}  [return description]
   */
  public getAlignGrid() {
    return this.alignGrid;
  }
  /**
   * 校验顶点是否在坐标点上
   *
   * @param   {number}   x  [x description]
   * @param   {number}   y  [y description]
   *
   * @return  {boolean}     [return description]
   */
  protected verifyVertex(x: number, y: number): boolean {
    return this.coordinator.x.includes(x) && this.coordinator.y.includes(y);
  }

  /**
   * 设置坐标图层
   *
   * @param   {ISize}  size  [size description]
   *
   * @return  {[type]}       [return description]
   */
  public setCoordinateSystemLayer(size: ISize) {
    const cs = new CoordinateLayer(size, this.coordinatorConfig.unitSize);
    this.layer.push(cs);
    return cs;
  }

  /**
   * 坐标系图层显示
   *
   * @param   {boolean}  visible  [visible description]
   *
   * @return  {[type]}            [return description]
   */
  public setCoordinateSystemVisible(visible: boolean) {
    this.coordinateSystemLayer.setVisible(visible);
  }

  /**
   * 设置大小
   *
   *  同步会更新网格
   * @param   {ISize}  size  [size description]
   *
   * @return  {[type]}       [return description]
   */
  public setCoordinateSystemSize(size: ISize) {
    /**
     * 设置大小
     *
     * @var {[type]}
     */
    this.coordinateSystemLayer.setSize(size.width, size.height);
    this.coordinatorConfig = { ...this.coordinatorConfig, ...size };
    this.coordinator = generateCoordinateSystem(this.coordinatorConfig);
    console.log(this.coordinator, 'this.coordinator-a');

    this.coordinateSystemLayer.drawGrid(this.coordinator, this.coordinatorConfig.unitSize);
    //通知网格变更
    getCoordinateObservable().next(() => {
      return new Promise((res) => {
        res({
          time: dayjs(),
          options: size,
          type: 'grid-size-set',
        });
      });
    });
    //计算完坐标后发送副本至所有的slot
    getPanelSendObservable().next({
      type: BACKUP_COORDINATOR_TRIGGER,
      time: dayjs(),
      value: this.coordinator,
    });
  }

  /**
   * 设置坐标系挂载节点
   *
   * @param   {HTMLElement}  dom  [dom description]
   *
   * @return  {[type]}            [return description]
   */
  public setCoordinateSystemLayerCanvasParentDom(dom: HTMLElement) {
    this.coordinateSystemLayer.setCanvasParentDom(dom);
  }

  public setProvider(dom: HTMLElement) {
    singletonDController.setProviderDom(dom);
  }
  /**
   * 图层是否展示
   *
   * @return  {[type]}  [return description]
   */
  public getCoordinateSystemVisible() {
    return this.coordinateSystemLayer.isVisible();
  }

  public getCoordinateSystemLayer() {
    return this.coordinateSystemLayer;
  }
  /**
   * 获取原始配置信息
   *
   * @return  {[type]}  [return description]
   */
  public getCoordinatorConfig() {
    return this.coordinatorConfig;
  }

  /**
   * 获取坐标
   *
   * @return  {[type]}  [return description]
   */
  public getCoordinator() {
    return this.coordinator;
  }

  /**
   * 初始化
   *
   * @return  {[type]}  [return description]
   */
  public clear() {
    console.log('clear');
    //将修正流移除
    removeAdjust();
    //取消panel的相关订阅
    removePanelAcceptObservable();
    removePanelSendObservable();
    //取消图层与面板的订阅消息
    removeLayerObservable();
    //移除坐标系事件
    removeCoordinateObservable();
  }
}
