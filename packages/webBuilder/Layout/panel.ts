import { ICoordinateSystemParams } from './coordinateSystem';
import { CoordinateLayer } from '../Layer/coordinateLayer';
import { removeAdjust } from '../renderStream/adjust';
import {
  removePanelAcceptObservable,
  removePanelSendObservable,
  getPanelAcceptObservable,
  getPanelSendObservable,
  SCALE_COORDINATOR_TRIGGER,
  TRANSFORM_END_TRIGGER,
  TRANSFORM_MOVING_TRIGGER,
  TRANSFORM_START_TRIGGER,
  ITransformValue,
  EDIT_STATUS_TRIGGER,
  CREATE_WIDGET,
  PANEL_SELECTION_TRIGGER,
  ISelectionParams,
  LAYOUT_CHANGE,
} from './subscribePanel';
import dayjs from 'dayjs';
import { removeLayerObservable } from '../Layer/layerSubscribe';
import { IUiTheme } from './theme';
import { removeCoordinateObservable } from '../Layer/coordinateLayerSubscribe';
import { singletonDController } from './DOMController';
import { PanelEvent } from '../eventStream/panelEvent';
import { Slots } from '../Slot/Slots';
import { removeDomObservable } from './domSubscribe';
import { OperationLayer } from '../Layer/operationLayer';
import { removeBothMoveObservable } from '../Slot/selection';
import { TemplateNode } from 'templateSlot';

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
  private isEdit: boolean;
  private uiTheme: IUiTheme;
  private event: PanelEvent;
  private loading = false;
  private currentLayer?: OperationLayer;
  private layer: OperationLayer[] = [];
  private coordinateSystemLayer: CoordinateLayer;
  private slots: Slots;

  /**
   * 长宽比例设置
   *
   * @param   {[type]}             width   [width description]
   * @param   {IPanelConstructor}  height  [height description]
   *
   * @return  {[type]}                     [return description]
   */
  constructor({ coordinateSystemConfig }: IPanelConstructor) {
    this.isEdit = false;
    /**
     * panel的事件对象统一的逐层下发事件
     *
     * @return  {[type]}  [return description]
     */
    this.event = new PanelEvent();

    this.coordinateSystemLayer = this.setCoordinateSystemLayer(
      {
        width: coordinateSystemConfig.width,
        height: coordinateSystemConfig.height,
      },
      coordinateSystemConfig
    );
    this.coordinateSystemLayer.drawGrid();
    //默认dim背景
    this.uiTheme = 'light';
    this.setTheme(this.uiTheme);
    //接收所有发送给panel的操作信息
    this.mapDataWithPanelAccept();
    //初始创建一个home图层,不可删除
    const home = this.addLayer();
    home.setDeletable(false);
    this.setCurrentLayer(home.id);
    this.slots = new Slots(this.coordinateSystemLayer);
  }

  public getSlots() {
    return this.slots;
  }
  /**
   * 获取当前图层
   *
   * @return  {[type]}  [return description]
   */
  public getCurrentLayer() {
    return this.currentLayer;
  }

  /**
   * 获取所有图层
   *
   * @return  {[type]}  [return description]
   */
  public getLayer() {
    return this.layer;
  }

  /**
   * 更改当前图层
   *
   * @param   {string}  layerId  [layerId description]
   *
   * @return  {[type]}           [return description]
   */
  public setCurrentLayer(layerId: string) {
    this.currentLayer = this.layer.filter((l) => l.id === layerId)[0];
    getPanelSendObservable().next({
      type: LAYOUT_CHANGE,
      time: dayjs(),
      value: this.currentLayer,
    });
    return this.currentLayer;
  }

  /**
   * 布局更改
   *
   * @param   {OperationLayer}  fn  [fn description]
   *
   * @return  {[type]}              [return description]
   */
  public onCurrentLayerChangeSubscribe(fn: (currentLayer: OperationLayer) => void) {
    getPanelSendObservable().subscribe((v) => {
      if (v.type === LAYOUT_CHANGE) {
        fn(v.value);
      }
    });
  }

  public onEditStatusSubscribe(fn: (state: boolean) => void) {
    getPanelSendObservable().subscribe((v) => {
      if (v.type === EDIT_STATUS_TRIGGER) {
        fn(v.value);
      }
    });
  }

  /**
   * 新建图层
   *
   * @return  {[type]}  [return description]
   */
  public addLayer() {
    const newLayer = new OperationLayer(this.coordinateSystemLayer.getConfig());
    this.layer.push(newLayer);
    return newLayer;
  }

  /**
   * 图层变更订阅
   *
   * @param   {OperationLayer}  callback  [callback description]
   *
   * @return  {[type]}                    [return description]
   */
  public onLayerChange(callback?: (node: OperationLayer) => void) {
    getPanelSendObservable().subscribe((v) => {
      if (v.type === LAYOUT_CHANGE) {
        callback && callback(v.value);
      }
    });
  }

  public getEvent() {
    return this.event;
  }

  /**
   * 处理接收到的广播信息
   *
   * @return  {[type]}  [return description]
   */
  private mapDataWithPanelAccept() {
    this.onSubscribeScale();
    this.onSubscribeCSTransform({});
    this.onSubscribeSelection();
    this.onLayerChange();
    this.onSubscribeSlots({});
  }

  public onSubscribeSlots(slotCallback: { create?: (node: TemplateNode) => void }) {
    getPanelAcceptObservable().subscribe((v) => {
      if (v.type === CREATE_WIDGET) {
        //往当前layer下注入节点id
        this.currentLayer?.addNode(v.value);
        slotCallback?.create && slotCallback?.create(v.value);
      }
    });
  }
  /**
   * 更改编辑状态
   *
   * @param   {boolean}  status  [status description]
   *
   * @return  {[type]}           [return description]
   */
  public setEditStatus(status: boolean) {
    getPanelSendObservable().next({
      type: EDIT_STATUS_TRIGGER,
      time: dayjs(),
      value: status,
    });
    this.isEdit = status;
  }

  /**
   * 多选节点
   *
   * @param   {ISelectionParams}  callbacks  [callbacks description]
   *
   * @return  {[type]}                       [return description]
   */
  public onSubscribeSelection(callbacks?: (e: ISelectionParams) => void) {
    getPanelAcceptObservable().subscribe((v) => {
      if (v.type === PANEL_SELECTION_TRIGGER) {
        this.currentLayer?.getSelectedNodes(
          v.value.downAbsolutePointer.x,
          v.value.moveAbsolutePointer.x,
          v.value.downAbsolutePointer.y,
          v.value.moveAbsolutePointer.y
        );
        callbacks && callbacks(v.value);
      }
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
    this.loading = state;
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
   * 获取线
   *
   * @param   {boolean}  filterVisible  筛选可视
   *
   * @return  {[type]}                  [return description]
   */
  public getCSLayerGrid() {
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
   * 设置坐标图层
   *
   * @param   {ISize}  size  [size description]
   *
   * @return  {[type]}       [return description]
   */
  public setCoordinateSystemLayer(size: ISize, config: ICoordinateSystemParams) {
    return new CoordinateLayer(size, config);
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
   * 坐标是否展示
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
    //将修正流移除
    removeAdjust();
    //取消panel的相关订阅
    removePanelAcceptObservable();
    removePanelSendObservable();
    //取消图层与面板的订阅消息
    removeLayerObservable();
    //移除坐标系事件
    removeBothMoveObservable();
    removeCoordinateObservable();
    removeDomObservable();
  }
}
