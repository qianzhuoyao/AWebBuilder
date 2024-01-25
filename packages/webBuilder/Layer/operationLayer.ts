import { buildId } from '../uuid';
import { ISize } from '../Layout/panel';
import { Layer } from './Layer';
import { TemplateNode } from '../templateSlot';
import { ReplaySubject, Subject, filter } from 'rxjs';
import { getBothMoveObservable } from '../Slot/selection';
import { mouseDown } from '../eventStream/keyEvent';
import { LAYOUT_CHANGE, getPanelSendObservable } from '../Layout/subscribePanel';

type ILayerEventName = 'selection';

export class OperationLayer extends Layer {
  //边界是否存在
  private isBound = true;
  //是否可删除
  private deletable = true;
  //选中订阅
  private selected$: Subject<Set<string>> = new Subject<Set<string>>();
  //事件订阅
  private on$: ReplaySubject<{
    layer?: OperationLayer;
    eventName: ILayerEventName;
  }> = new ReplaySubject();
  //当前图层下的所有节点id集合
  private nodeIdList: Map<string, TemplateNode> = new Map([]);
  //默认操作对齐网格方式just-vertex
  private alignGrid: 'just-vertex' | 'strict-vertex' | 'none' = 'just-vertex';
  private selectedNodeIdList: Set<string> = new Set();
  public readonly id = buildId();
  private layerName = 'scene';

  constructor(Size: ISize) {
    super(Size);
    getPanelSendObservable().subscribe((v) => {
      if (v.type === LAYOUT_CHANGE) {
        if (v.value.id === this.id) {
          //顶层图层才显示
          this.setZIndex(1);
        } else {
          this.setZIndex(2);
        }
      }
    });
    mouseDown(
      (e) => {
        if (e.target instanceof HTMLElement) {
          if (e.target.getAttribute('data-isNode') !== '1') {
            this.selected$.next(new Set([]));
          } else {
            this.selected$.next(new Set([e.target.id]));
          }
        }
      },
      {
        first: true,
        repeat: true,
      }
    );
    this.selected$
      .pipe(
        filter(() => {
          console.log(this.getZIndex(), 'this.isShow');
          return this.getZIndex() === 1;
        })
      )
      .subscribe((v) => {
        console.log(v, this.getZIndex(), this.nodeIdList, 'v-sv');
        this.selectedNodeIdList = v;
        const currentSelectedNodes: TemplateNode[] = [];
        //同步至slots
        this.nodeIdList.forEach((node) => {
          if (this.selectedNodeIdList.has(node.getId())) {
            currentSelectedNodes.push(node);
            node.boxVisible();
          } else {
            node.boxHidden();
          }
        });
        if (this.selectedNodeIdList.size > 1) {
          this.on$.next({
            eventName: 'selection',
            layer: this,
          });
          //同步移动其他的
          getBothMoveObservable().next({
            type: 'SIGNAL',
            bothId: [...this.selectedNodeIdList],
            syncPosition: currentSelectedNodes.map((node) => {
              return {
                id: node.getId(),
                left: node.getMovable()?.getRect().left || 0,
                top: node.getMovable()?.getRect().top || 0,
              };
            }),
          });
        }
      });
  }

  public getIsBound() {
    return this.isBound;
  }

  public on(onEventName: ILayerEventName, callback: (e?: OperationLayer) => any) {
    this.on$.subscribe(({ eventName, layer }) => {
      eventName === onEventName && callback(layer);
    });
  }
  /**
   * 获取多选区域内选中的节点
   *
   * @param   {number}  x1  [x1 description]
   * @param   {number}  x2  [x2 description]
   * @param   {number}  y1  [y1 description]
   * @param   {number}  y2  [y2 description]
   *
   * @return  {[type]}      [return description]
   */
  public getSelectedNodes(x1: number, x2: number, y1: number, y2: number) {
    console.log('p[polo');
    const MaxX = Math.max(x1, x2);
    const MinX = Math.min(x1, x2);
    const MaxY = Math.max(y1, y2);
    const MinY = Math.min(y1, y2);
    const S: Set<string> = new Set();
    this.nodeIdList.forEach((node) => {
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
        S.add(node.getId());
      }
    });

    this.selected$.next(S);
  }
  /**
   * 添加节点
   *
   * @param   {string}  nodeId  [nodeId description]
   *
   * @return  {[type]}          [return description]
   */
  public addNode(node: TemplateNode) {
    // node.getMovable()?.on('click', () => {
    //   this.selected$.next(new Set([node.getId()]));
    // });
    this.nodeIdList.set(node.getId(), node);
  }

  public setNode() {
    //
  }
  public deleteNode(nodeList: TemplateNode[]) {
    nodeList.map((node) => {
      this.nodeIdList.delete(node.getId());
      this.selectedNodeIdList.delete(node.getId());
    });
  }

  public clear() {
    this.selected$.unsubscribe();
  }
  public getNodes() {
    return this.nodeIdList;
  }

  public checkTempIsIn(tempId: string) {
    console.log(tempId, 'tempId');
    return this.nodeIdList.has(tempId);
  }

  public clearNode() {
    this.nodeIdList = new Map();
    this.selectedNodeIdList = new Set();
  }
  /**
   * 选中节点
   *
   * @param   {string}  id  [id description]
   *
   * @return  {[type]}      [return description]
   */
  public selectNode(id: string) {
    console.log(id, 'selectNode-selectNode');
    this.selected$.next(new Set([id]));
  }
  public unSelectNode(ids: string[]) {
    ids.map((id) => {
      this.selectedNodeIdList.delete(id);
    });
    this.selected$.next(this.selectedNodeIdList);
  }
  public clearSelectedNode() {
    this.selectedNodeIdList = new Set();
    this.selected$.next(this.selectedNodeIdList);
  }

  public setName(name: string) {
    this.layerName = name;
  }

  public getName() {
    return this.layerName;
  }

  public setDeletable(able: boolean) {
    this.deletable = able;
  }
}
