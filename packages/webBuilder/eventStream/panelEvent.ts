import { keyDown, keyUp, mouseDown, mouseMove, mouseUp } from '../eventStream/keyEvent';
/**
 *
 * panel 上的事件优先级为
 * panel -> layer(layer下坐标系操作优先级最高) ->widget
 * panel 上的默认事件
 * 包含
 * panel 点击 它优先于所有图层的点击
 * panel 上的 多选
 */
export class PanelEvent {
  private defaultOption: Record<string, any> = {};

  constructor() {
    this.defaultOption = {
      first: true,
      repeat: true,
    };

    this.onKeyDownSubscribe(this.defaultKeyDown);
    this.onKeyUpSubscribe(this.defaultKeyUp);
    this.onMouseDownSubscribe(this.defaultMouseDown);
    this.onMouseUpSubscribe(this.defaultMouseUp);
    this.onMouseMoveSubscribe(this.defaultMouseMove);
  }

  protected defaultKeyDown(e: KeyboardEvent) {
    //默认panel层键盘按下事件
  }
  protected defaultKeyUp(e: KeyboardEvent) {
    //默认panel层键盘抬起事件
  }
  protected defaultMouseDown(e: MouseEvent) {
    //默认panel层鼠标按下事件
  }
  protected defaultMouseUp(e: MouseEvent) {
    //默认panel层鼠标抬起事件
  }
  protected defaultMouseMove(e: MouseEvent) {
    //默认panel层鼠标移动事件
  }

  public onMouseMoveSubscribe(callback?: (e: MouseEvent) => void) {
    mouseMove(callback, this.defaultOption);
  }
  public onMouseUpSubscribe(callback?: (e: MouseEvent) => void) {
    mouseUp(callback, this.defaultOption);
  }
  public onMouseDownSubscribe(callback?: (e: MouseEvent) => void) {
    mouseDown(callback, this.defaultOption);
  }
  public onKeyUpSubscribe(callback?: (e: KeyboardEvent) => void) {
    keyUp(callback, this.defaultOption);
  }
  public onKeyDownSubscribe(callback?: (e: KeyboardEvent) => void) {
    keyDown(callback, this.defaultOption);
  }
}
