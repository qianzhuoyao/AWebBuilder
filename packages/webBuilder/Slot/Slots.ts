import { TemplateNode } from '../templateSlot/index';
import { CREATE_WIDGET, ISendMsg, getPanelSendObservable } from '../Layout/subscribePanel';
import { getSelectionObservable } from './selection';
import { keyUp, mouseDown } from '../eventStream/keyEvent';
import { filter, map, withLatestFrom } from 'rxjs';

/**
 * 显示单元
 */
export class Slots {
  private Templates: Map<string, TemplateNode> = new Map([]);
  private selection: TemplateNode[] = [];
  private selectionPointer: Map<string, { x: number; y: number }> = new Map();
  private current: TemplateNode | null = null;
  constructor() {
    mouseDown().observable.subscribe((b) => {
      if ((b.target as HTMLElement).getAttribute('data-isNode') !== '1') {
        this.Templates.forEach((t) => {
          t.blur();
        });
      }
      console.log(b, 'casvgasgasgasgasgas');
    });
    getSelectionObservable().subscribe((v) => {
      if (v.type === 'select') {
        this.selection.map((s) => {
          this.selectionPointer.set(s.getId(), {
            x: s.getMovable()?.getRect().left || 0,
            y: s.getMovable()?.getRect().top || 0,
          });
        });
      }
      if (v.type === 'select' && this.selection.length <= 1) {
        this.Templates.forEach((t) => {
          if (t.getId() !== v.value.getId()) {
            t.blur();
          } else {
            this.current = t;
            t.focus();
          }
        });
      } else if (v.type === 'selection-move') {
        console.log(v.value, 'casvvvv');
        this.selection.map((s) => {
          if (s.getId() !== this.current?.getId()) {
            (s.getNode() as HTMLElement).style.top =
              (this.selectionPointer.get(s.getId())?.y || 0) + v.value.top + 'px';
            (s.getNode() as HTMLElement).style.left =
              (this.selectionPointer.get(s.getId())?.x || 0) + v.value.left + 'px';
          }
          s.getMovable()?.updateRect();
        });
      } else if (v.type === 'selection-over') {
        this.current = null;
        this.selection = [];
      }
    });
    //订阅来自panel的消息
    getPanelSendObservable().subscribe((msg) => {
      this.processingUnit(msg);
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
    const MaxX = Math.max(x1, x2);
    const MinX = Math.min(x1, x2);
    const MaxY = Math.max(y1, y2);
    const MinY = Math.min(y1, y2);
    const s: TemplateNode[] = [];
    this.Templates.forEach((node) => {
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
        node.focus();

        s.push(node);
      }
    });
    this.selection = s;
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
