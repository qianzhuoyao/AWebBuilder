import { Layer } from '../Layer/Layer';
import { ICoordinateSystemParams } from './coordinateSystem';
import { CoordinateLayer } from '../Layer/coordinateLayer';
import { getAdjust, removeAdjust } from '../renderStream/adjust';
import { mergeTaskPipe } from '../Queue/mergeTaskPipe';
import {
  ALIGN_TRIGGER,
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
  EDIT_STATUS_TRIGGER,
  CREATE_WIDGET,
} from './subscribePanel';
import dayjs from 'dayjs';
import { removeLayerObservable } from '../Layer/layerSubscribe';
import { IUiTheme } from './theme';
import {
  getCoordinateObservable,
  removeCoordinateObservable,
} from '../Layer/coordinateLayerSubscribe';
import { singletonDController } from './DOMController';
import { PanelEvent } from '../eventStream/panelEvent';
import { Slots } from '../Slot/Slots';

type IWidget = 'chart' | 'table' | 'text' | 'image';

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
  private widgetType?: IWidget;
  private isEdit: boolean;
  private uiTheme: IUiTheme;
  private event: PanelEvent;
  private loading = false;
  private layer: Layer[] = [];
  private coordinateSystemLayer: CoordinateLayer;
  private slots: Slots;

  // /**
  //  * 缩放比例
  //  *
  //  * @var {[type]}
  //  */
  // private scale = 1;
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
    this.slots = new Slots();
    this.isEdit = false;
    this.event = new PanelEvent();
    //默认操作对齐网格方式just-vertex
    this.alignGrid = 'just-vertex';

    this.coordinateSystemLayer = this.setCoordinateSystemLayer(
      {
        width: coordinateSystemConfig.width,
        height: coordinateSystemConfig.height,
      },
      coordinateSystemConfig
    );
    this.coordinateSystemLayer.drawGrid();
    //注册下对齐的调整流,初始进入不执行修正流，执行初次渲染的修正
    this.initAlignGridStream();
    //默认dim背景
    this.uiTheme = 'light';
    this.setTheme(this.uiTheme);
    //接收所有发送给panel的操作信息
    this.mapDataWithPanelAccept();
    //处理默认的来自坐标系的事件消息
    this.mapCoordinateEvent();
    //初始关于widget的渲染订阅
    this.onCreateWidget();
  }

  protected mapCoordinateEvent() {
    this.coordinateSystemLayer.onCoordinateSystemLayerEvent((v) => {
      if (v.type === 'fCanvas-mouse-up') {
        this.setEditStatus(true);
      }
    });
  }
  /**
   * 编辑状态的订阅
   *
   * @param   {boolean}  callback  [callback description]
   *
   * @return  {[type]}             [return description]
   */
  public onEditStatusSubscribe(callback: (state: boolean) => void) {
    getPanelSendObservable().subscribe((v) => {
      if (v.type === EDIT_STATUS_TRIGGER) {
        callback(this.isEdit);
      }
    });
  }

  public getEvent() {
    return this.event;
  }

  public resetCurrentWidgetWillBuilder() {
    this.widgetType = undefined;
    this.coordinateSystemLayer.setFCanvasSelection(false);
  }
  public currentWidgetWillBuilder(widgetType: IWidget) {
    this.widgetType = widgetType;
    this.coordinateSystemLayer.setFCanvasSelection(true);
  }

  /**
   * 创建组件放置区块订阅
   * 创建空间
   *
   * @return  {[type]}  [return description]
   */
  public onCreateWidget() {
    const startCoord: { pageX: number; pageY: number; pointX: number; pointY: number } = {
      pageX: 0,
      pageY: 0,
      pointX: 0,
      pointY: 0,
    };
    getCoordinateObservable()
      .pipe(mergeTaskPipe(10))
      .subscribe((v) => {
        if (v.type === 'fCanvas-mouse-down') {
          console.log(v, 'onHandleCreateWidget');
          // startCoord.x = v.options.
          startCoord.pageX = v.options.e.pageX;
          startCoord.pageY = v.options.e.pageY;
          startCoord.pointX = v.options.pointer.x;
          startCoord.pointY = v.options.pointer.y;
        }
        if (this.isEdit && this.widgetType && v.type === 'fCanvas-mouse-up') {
          getPanelSendObservable().next({
            type: CREATE_WIDGET,
            time: dayjs(),
            value: {
              pageY: startCoord.pageY,
              pageX: startCoord.pageX,
              pointX: startCoord.pointX,
              pointY: startCoord.pointY,
              width: v.options.e.pageX - startCoord.pageX,
              height: v.options.e.pageY - startCoord.pageY,
            },
          });
        }
      });
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
   * 更改编辑状态
   *
   * @param   {boolean}  status  [status description]
   *
   * @return  {[type]}           [return description]
   */
  public setEditStatus(status: boolean) {
    this.isEdit = status;
    getPanelSendObservable().next({
      type: EDIT_STATUS_TRIGGER,
      time: dayjs(),
      value: this.isEdit,
    });
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
        //开始
        callbacks.start && callbacks.start(v.value);
      } else if (v.type === TRANSFORM_MOVING_TRIGGER) {
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
        this.coordinateSystemLayer.drawGrid();
      }
    }
  }

  /**
   * 获取线坐标
   *
   * @param   {boolean}  filterVisible  筛选可视
   *
   * @return  {[type]}                  [return description]
   */
  public getCoordinateSystemLayerGrid() {
    return this.coordinateSystemLayer.getGridObj();
  }

  public onSubscribeScale(callback?: (scale: number) => void) {
    getPanelAcceptObservable().subscribe((v) => {
      if (v.type === SCALE_COORDINATOR_TRIGGER) {
        callback && callback(v.value);
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

  /**
   * 设置坐标图层
   *
   * @param   {ISize}  size  [size description]
   *
   * @return  {[type]}       [return description]
   */
  public setCoordinateSystemLayer(size: ISize, config: ICoordinateSystemParams) {
    const cs = new CoordinateLayer(size, config);
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
   * 设置坐标系挂载节点
   *
   * @param   {HTMLElement}  dom  [dom description]
   *
   * @return  {[type]}            [return description]
   */
  public setCoordinateLayerParentDom(dom: HTMLElement) {
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
