import { singletonDController } from '../Layout/DOMController';
import { ISize } from '../Layout/panel';

export class Layer {
  //层级
  protected zIndex = 1;

  /**
   * 偏移量
   *
   * @var {[type]}
   * x y
   */
  //可以更改的容器，便于操作坐标事件
  protected newProvider: HTMLElement | null = null;
  protected offset: [number, number] = [0, 0];
  protected width: number;
  protected height: number;

  protected layerDom: HTMLElement | HTMLCanvasElement | null = null;

  constructor(layerSize: ISize) {
    this.height = layerSize.height;
    this.width = layerSize.width;
  }

  public setLayerDom(dom: HTMLElement | HTMLCanvasElement) {
    this.layerDom = dom;
    singletonDController.insertDoms(dom);
  }
  /**
   * 自动挂载一个div到dom上
   *
   * @return  {[type]}  [return description]
   */
  // private setDefaultMountByDom() {
  //   const newDom = singletonDController.addDomRetEle();
  //   if (!newDom) {
  //     throw new Error('create error');
  //   }
  //   //在canvas 上面
  //   newDom.style.position = 'absolute';
  //   newDom.style.width = this.width + 'px';
  //   newDom.style.height = this.height + 'px';
  //   return newDom;
  // }

  protected setOffset(left: number, top: number) {
    this.offset = [left, top];
  }

  /**
   * 设置层级
   *
   * @param   {number}  zIndex  [zIndex description]
   *
   * @return  {[type]}          [return description]
   */
  public setZIndex(zIndex: number) {
    this.zIndex = zIndex;
  }

  /**
   * 设置尺寸
   *
   * @param   {number}  w  [w description]
   * @param   {number}  h  [h description]
   *
   * @return  {[type]}     [return description]
   */
  public setSize(w: number, h: number) {
    this.width = w;
    this.height = h;
    if (this.layerDom) {
      this.layerDom.style.width = this.width + 'px';
      this.layerDom.style.height = this.height + 'px';
    }
  }
  /**
   * 设置可视
   *
   * @param   {boolean}  visible  [visible description]
   *
   * @return  {[type]}            [return description]
   */
  public setVisible(visible: boolean) {
    if (this.layerDom) {
      this.layerDom.style.display = visible ? 'block' : 'none';
    }
  }
  /**
   * 获取可视
   *
   * @return  {[type]}  [return description]
   */
  public isVisible() {
    if (this.layerDom) {
      return this.layerDom.style.display !== 'none';
    }
    return false;
  }

  /**
   * 获取容器
   *
   * @return  {[type]}  [return description]
   */
  public getLayerDom() {
    return this.layerDom;
  }
}
