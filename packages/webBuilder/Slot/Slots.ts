import { IWidgetType, TemplateNode } from '../templateSlot/index';
import {
  CREATE_WIDGET,
  LAYOUT_CHANGE,
  getPanelAcceptObservable,
  getPanelSendObservable,
} from '../Layout/subscribePanel';

import { takeWhile } from 'rxjs';
import { mergeTaskPipe } from '../Queue/mergeTaskPipe';
import { getCoordinateObservable } from '../Layer/coordinateLayerSubscribe';
import { buildId } from '../uuid';
import dayjs from 'dayjs';
import { CoordinateLayer } from '../Layer/coordinateLayer';
import { OperationLayer } from 'Layer/operationLayer';

/**
 * 显示单元
 */
export class Slots {
  private Templates: Map<string, TemplateNode> = new Map([]);
  private selection: TemplateNode[] = [];
  private belongLayer?: OperationLayer;
  private coordinateSystem: CoordinateLayer;
  //创建类型
  private widgetType?: IWidgetType;
  constructor(coord: CoordinateLayer) {
    this.coordinateSystem = coord;
    //所有节点的创建流
    this.onCreateWidget();
    //监听面板当前layer
    getPanelSendObservable().subscribe((v) => {
      if (v.type === LAYOUT_CHANGE) {
        this.setBelongLayer(v.value);
      }
    });
  }

  public setBelongLayer(layer?: OperationLayer) {
    this.belongLayer = layer;
  }

  public setWidgetType(type?: IWidgetType) {
    this.widgetType = type;
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
      .pipe(
        takeWhile(() => !!this.widgetType && !!this.belongLayer),
        mergeTaskPipe(10)
      )
      .subscribe((v) => {
        if (v.type === 'fCanvas-mouse-down') {
          // startCoord.x = v.options.
          startCoord.pageX = v.options.e.pageX;
          startCoord.pageY = v.options.e.pageY;
          startCoord.pointX = v.options.pointer.x;
          startCoord.pointY = v.options.pointer.y;
        }
        if (this.widgetType && v.type === 'fCanvas-mouse-up') {
          if (!this.belongLayer) {
            return;
          }
          const nodeId = buildId();
          const node = new TemplateNode({
            id: nodeId,
            layer: this.belongLayer,
            type: this.widgetType,
            pageY: startCoord.pageY,
            pageX: startCoord.pageX,
            pointX: startCoord.pointX,
            pointY: startCoord.pointY,
            width: v.options.e.pageX - startCoord.pageX,
            height: v.options.e.pageY - startCoord.pageY,
          });
          this.Templates.set(nodeId, node);
          //通知panel创建成功一个widget
          getPanelAcceptObservable().next({
            type: CREATE_WIDGET,
            time: dayjs(),
            value: node,
          });
        }
      });
  }
  public getSelectionNodes() {
    return this.selection;
  }

  /**
   * 多选
   *
   * @param   {number}  x1  [x1 description]
   * @param   {number}  x2  [x2 description]
   * @param   {number}  y1  [y1 description]
   * @param   {number}  y2  [y2 description]
   *
   * @return  {[type]}      [return description]
   */
  public selectNode(x1: number, x2: number, y1: number, y2: number) {
    const MaxX = Math.max(x1, x2);
    const MinX = Math.min(x1, x2);
    const MaxY = Math.max(y1, y2);
    const MinY = Math.min(y1, y2);
    const s: TemplateNode[] = [];
    this.Templates.forEach((node) => {
      const rect = node.getMovable()?.getRect();
      if (!rect) {
        return;
      }
      const nodeX1 = rect.left;
      const nodeX2 = rect.left + rect.width;
      const nodeY1 = rect.top;
      const nodeY2 = rect.top + rect.height;
      if (
        ((nodeX1 >= MinX && nodeX1 <= MaxX) || (nodeX2 >= MinX && nodeX2 <= MaxX)) &&
        ((nodeY1 >= MinY && nodeY1 <= MaxY) || (nodeY2 >= MinY && nodeY2 <= MaxY))
      ) {
        s.push(node);
      }
    });
    this.selection = s;
  }
}
