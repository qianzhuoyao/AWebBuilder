import { TemplateNode } from '../templateSlot/index';
import { CREATE_WIDGET, ISendMsg, getPanelSendObservable } from '../Layout/subscribePanel';

/**
 * 显示单元
 */
export class Slots {
  private Templates: Map<string, TemplateNode> = new Map([]);
  constructor() {
    //订阅来自panel的消息
    getPanelSendObservable().subscribe((msg) => {
      this.processingUnit(msg);
    });
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
