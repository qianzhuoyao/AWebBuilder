import { TemplateNode } from '../templateSlot/index';
import { CREATE_WIDGET, ISendMsg, getPanelSendObservable } from '../Layout/subscribePanel';
import { getSelectionNodesObservable } from './selectionNodeOpSubscribe';

/**
 * 显示单元
 */
export class Slots {
  private Templates: Map<string, TemplateNode> = new Map([]);
  private selectionNodes: TemplateNode[] = [];
  constructor() {
    //订阅来自panel的消息
    getPanelSendObservable().subscribe((msg) => {
      this.processingUnit(msg);
    });
    getSelectionNodesObservable().subscribe((v) => {
      if (v.type === 'MOVE_START' && this.selectionNodes.length) {
        this.selectionNodes.map((tem) => {
          tem.setSyncStartPosition();
        });
      }

      if (v.type === 'MOVE' && this.selectionNodes.length) {
        console.log(v.value.info, 'moa0ppss');
        this.selectionNodes.map((tem) => {
          if (tem.getId() !== v.value.id) {
            tem.syncPosition(v.value.info.left, v.value.info.top);
          }
        });
      }
    });
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
    this.selectionNodes = [];
    const MaxX = Math.max(x1, x2);
    const MinX = Math.min(x1, x2);
    const MaxY = Math.max(y1, y2);
    const MinY = Math.min(y1, y2);
    this.Templates.forEach((node) => {
      const rect = node.getMovable()?.getRect();
      if (!rect) {
        node.blur();
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
        node.focus();
        this.selectionNodes.push(node);
      } else {
        node.blur();
      }
    });
    console.log(this.selectionNodes, 'ascascacacascasccwww');
    return this.selectionNodes;
  }

  public filterTemp(ids: string[]) {
    const res: TemplateNode[] = [];
    this.Templates.forEach((node) => {
      if (ids.includes(node.getId())) {
        res.push(node);
      }
    });
    return res;
  }

  public unFilterTemp(ids: string[]) {
    const res: TemplateNode[] = [];
    this.Templates.forEach((node) => {
      if (!ids.includes(node.getId())) {
        res.push(node);
      }
    });
    return res;
  }

  /**
   * 筛选节点
   *
   * @return  {[type]}  [return description]
   */
  public filterTempNode(ids: string[]) {
    return this.filterTemp(ids).map((n) => n.getNode());
  }
  public unFilterTempNode(ids: string[]) {
    return this.unFilterTemp(ids).map((n) => n.getNode());
  }
  /**
   * 订阅处理单元
   *
   * @param   {IMsg}  msg  [msg description]
   *
   * @return  {[type]}     [return description]
   */
  private processingUnit(msg: ISendMsg) {
    //新建
    if (msg.type === CREATE_WIDGET) {
      console.log(msg, 's0v');
      const newTemp = new TemplateNode(msg.value);
      if (newTemp.getNode() instanceof HTMLElement) {
        this.Templates.set(newTemp.getId(), newTemp);
      }
    }
  }
}
