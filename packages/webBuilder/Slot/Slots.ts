import { IWidgetType, TemplateNode } from '../templateSlot/index';
import {
  CREATE_WIDGET,
  LAYOUT_CHANGE,
  getPanelAcceptObservable,
  getPanelSendObservable,
} from '../Layout/subscribePanel';
import { mergeTaskPipe } from '../Queue/mergeTaskPipe';
import { getCoordinateObservable } from '../Layer/coordinateLayerSubscribe';
import { buildId } from '../uuid';
import dayjs from 'dayjs';
import { CoordinateLayer } from '../Layer/coordinateLayer';
import { OperationLayer } from 'Layer/operationLayer';
import { ReplaySubject } from 'rxjs';
import { mouseDown } from '../eventStream/keyEvent';

type IEventName = 'click' | 'dragStart' | 'drag' | 'dragEnd' | 'mouseDownEmpty';

/**
 * 显示单元
 */
export class Slots {
  private Templates: Map<string, TemplateNode> = new Map([]);
  private belongLayer?: OperationLayer;
  private coordinateSystem: CoordinateLayer;
  private on$: ReplaySubject<{
    node?: TemplateNode;
    eventName: IEventName;
  }> = new ReplaySubject();
  //创建类型
  private widgetType?: IWidgetType;
  constructor(coord: CoordinateLayer) {
    //点击空的
    mouseDown(
      (e) => {
        if (e.target instanceof HTMLElement) {
          if (e.target.getAttribute('data-isNode') !== '1') {
            this.on$.next({
              eventName: 'mouseDownEmpty',
              node: undefined,
            });
          }
        }
      },
      {
        repeat: true,
        first: true,
      }
    );

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

  //监听事件
  public on(onEventName: IEventName, listener: (e?: TemplateNode) => any) {
    this.on$.subscribe(({ node, eventName }) => {
      onEventName === eventName && listener(node);
    });
  }

  public setBelongLayer(layer?: OperationLayer) {
    this.belongLayer = layer;
  }

  public setWidgetType(type?: IWidgetType) {
    this.widgetType = type;
    this.coordinateSystem.setFCanvasSelection(!!type);
  }

  protected nodeEmit(node: TemplateNode) {
    node.getMovable()?.on('click', () => {
      console.log('vashbhhbhh');
      this.on$.next({
        eventName: 'click',
        node: node,
      });
    });
    node.getMovable()?.on('dragStart', () => {
      this.on$.next({
        eventName: 'dragStart',
        node: node,
      });
    });
    node.getMovable()?.on('drag', () => {
      this.on$.next({
        eventName: 'drag',
        node: node,
      });
    });
    node.getMovable()?.on('dragEnd', () => {
      this.on$.next({
        eventName: 'dragEnd',
        node: node,
      });
    });
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
        if (!!this.widgetType && !!this.belongLayer) {
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
            this.nodeEmit(node);
            this.Templates.set(nodeId, node);
            //通知panel创建成功一个widget
            getPanelAcceptObservable().next({
              type: CREATE_WIDGET,
              time: dayjs(),
              value: node,
            });
          }
        }
      });
  }
}
