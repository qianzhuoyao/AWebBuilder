import { TemplateNode } from '../templateSlot/index';
import { CREATE_WIDGET, ISendMsg, getPanelSendObservable } from '../Layout/subscribePanel';

/**
 * 显示单元
 */
export class Slots {
  private Templates: Map<string, HTMLElement> = new Map([]);
  constructor() {
    //订阅来自panel的消息
    getPanelSendObservable().subscribe((msg) => {
      this.processingUnit(msg);
    });
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
        this.Templates.set(newTemp.getId(), newTemp.getNode() as HTMLElement);
      }
    }
  }
}
