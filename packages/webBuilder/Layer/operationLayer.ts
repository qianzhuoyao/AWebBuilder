import { buildId } from '../uuid';
import { ISize } from '../Layout/panel';
import { Layer } from './Layer';

export class OperationLayer extends Layer {
  private nodes: string[] = [];
  private selected: Set<string> = new Set();
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
  public addNode(nodeId: string) {
    this.nodes.push(nodeId);
  }

  /**
   * 选中节点
   *
   * @param   {string}  id  [id description]
   *
   * @return  {[type]}      [return description]
   */
  public toSelectNode(id: string) {
    this.selected.add(id);
  }

  /**
   * 获取图层内的tempnode id 集合
   *
   * @return  {[type]}  [return description]
   */
  public getNode() {
    return this.nodes;
  }

  public setName(name: string) {
    this.layerName = name;
  }
  /**
   * 获取图层名称
   *
   *
   * @return  {[type]}  [return description]
   */
  public getName() {
    return this.layerName;
  }
}
