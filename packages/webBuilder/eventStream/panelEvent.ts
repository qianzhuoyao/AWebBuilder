import { keyDown, keyUp } from '../eventStream/keyEvent';
export class PanelEvent {
  /**
   * 按下事件
   *
   * @param   {KeyboardEvent}  callback  [callback description]
   *
   * @return  {[type]}                   [return description]
   */
  public onKeyDown(callback: (e: KeyboardEvent) => void) {
    keyDown(callback, {
      first: true,
      repeat: true,
    });
  }
  /**
   * 抬起事件
   *
   * @param   {KeyboardEvent}  callback  [callback description]
   *
   * @return  {[type]}                   [return description]
   */
  public onKeyUp(callback: (e: KeyboardEvent) => void) {
    keyUp(callback, {
      first: true,
      repeat: true,
    });
  }
}
