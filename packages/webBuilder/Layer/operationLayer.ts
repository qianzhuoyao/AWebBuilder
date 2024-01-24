import { buildId } from '../uuid';
import { ISize } from '../Layout/panel';
import { Layer } from './Layer';
import { TemplateNode } from '../templateSlot';

export class OperationLayer extends Layer {
  private deletable = true;
  //当前图层下的所有节点id集合
  private nodeIdList: Map<string, TemplateNode> = new Map([]);
  //默认操作对齐网格方式just-vertex
  private alignGrid: 'just-vertex' | 'strict-vertex' | 'none' = 'just-vertex';
  private selectedNodeIdList: Set<string> = new Set();
  public readonly id = buildId();
  private layerName = 'scene';

  constructor(Size: ISize) {
    super(Size);
  }

  /**
   * 添加节点
   *
   * @param   {string}  nodeId  [nodeId description]
   *
   * @return  {[type]}          [return description]
   */
  public addNode(node: TemplateNode) {
    this.nodeIdList.set(node.getId(), node);
  }
  public deleteNode(nodeList: TemplateNode[]) {
    nodeList.map((node) => {
      this.nodeIdList.delete(node.getId());
    });
  }
  public clearNode() {
    this.nodeIdList = new Map();
  }
  /**
   * 选中节点
   *
   * @param   {string}  id  [id description]
   *
   * @return  {[type]}      [return description]
   */
  public selectNode(id: string) {
    this.selectedNodeIdList.add(id);
  }
  public unSelectNode(ids: string[]) {
    ids.map((id) => {
      this.selectedNodeIdList.delete(id);
    });
  }
  public clearSelectedNode() {
    this.selectedNodeIdList = new Set();
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
