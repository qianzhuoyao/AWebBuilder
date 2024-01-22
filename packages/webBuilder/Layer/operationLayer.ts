import { buildId } from '../uuid';
import { ISize } from '../Layout/panel';
import { Layer } from './Layer';

export class OperationLayer extends Layer {
  private nodes: string[] = [];
  public readonly id = buildId();

  private layerName = 'scene';
  constructor(Size: ISize) {
    super(Size);
  }
  public addNode(nodeId: string) {
    this.nodes.push(nodeId);
  }

  public getNode() {
    return this.nodes;
  }
  public getName() {
    return this.layerName;
  }
}
