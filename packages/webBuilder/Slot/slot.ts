import {
  ALIGN_TRIGGER,
  BACKUP_COORDINATOR_TRIGGER,
  ISendMsg,
  getPanelSendObservable,
} from '../Layout/subscribePanel';

export interface ISlot {
  isMounted: boolean;
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
}

/**
 * 显示单元
 */
export class Slot {
  private isMounted = false;
  private key = 'DEFAULT';
  private x = -1;
  private y = -1;
  private w = -1;
  private h = -1;
  private z = -1;
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
    //处理对齐任务
    if (msg.type === ALIGN_TRIGGER) {
      //处理对齐
    } else if (msg.type === BACKUP_COORDINATOR_TRIGGER) {
      //备份坐标系
    }
  }
}
