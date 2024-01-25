import { buildId } from '../uuid';
import { ISize } from '../Layout/panel';
import { Layer } from './Layer';
import { TemplateNode } from '../templateSlot';
import { Subject, filter } from 'rxjs';
import { getBothMoveObservable } from '../Slot/selection';
import { mouseDown } from '../eventStream/keyEvent';
import { LAYOUT_CHANGE, getPanelSendObservable } from '../Layout/subscribePanel';

export class OperationLayer extends Layer {
  private deletable = true;
  private selected$: Subject<Set<string>> = new Subject<Set<string>>();
  private isShow = false;
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
        console.log(v, this.id, 'vvvv0gt');
        if (v.value.id === this.id) {
          //当前图层才显示
          this.isShow = true;
        } else {
          this.isShow = false;
        }
      }
    });
    mouseDown(
      (e) => {
        if (!this.isShow) {
          return;
        }
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
          console.log(this.isShow, 'this.isShow');
          return this.isShow;
        })
      )
      .subscribe((v) => {
        console.log(v, this.isShow, this.nodeIdList, 'v-sv');
        this.selectedNodeIdList = v;
        const currentSelectedNodes: TemplateNode[] = [];
        //同步至slots
        this.nodeIdList.forEach((node) => {
          const box = node.getMovable()?.getControlBoxElement();
          if (!box) {
            return;
          }
          if (this.selectedNodeIdList.has(node.getId())) {
            currentSelectedNodes.push(node);
            box.style.visibility = 'visible';
          } else {
            box.style.visibility = 'hidden';
          }
        });
        if (this.selectedNodeIdList.size > 1) {
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
