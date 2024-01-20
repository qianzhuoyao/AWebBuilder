import { buildId } from '../uuid';

/**
 * dom
 * 控制器
 * 收集分发
 * 新建，编辑，删除 构建的dom
 */
export class DController {
  private static instance: DController | null = null;
  private provider: HTMLElement = document.body;
  private doms: Map<string, HTMLElement | HTMLCanvasElement> = new Map([]);
  private constructor() {
    // 私有构造函数，防止外部实例化
  }

  /**
   * 单例
   *
   * @return  {DController}[return description]
   */
  public static getInstance(): DController {
    if (!DController.instance) {
      DController.instance = new DController();
    }
    return DController.instance;
  }

  /**
   * 会变更doms的所属位置
   *
   * @param   {HTMLElement}  provider  [provider description]
   *
   * @return  {[type]}                 [return description]
   */
  public setProviderDom(provider: HTMLElement) {
    if (DController.instance) {
      DController.instance.provider = provider;
      DController.instance.doms.forEach((dom) => {
        DController.instance?.provider.appendChild(dom);
      });
    }
  }
  /**
   * 新建canvas
   * 返回canvas
   *
   */
  public addCanvasRetCanvas(): HTMLCanvasElement | undefined {
    const canvasId = DController.instance?.addCanvas();
    if (!canvasId) {
      return;
    }
    return DController.instance?.doms.get(canvasId) as HTMLCanvasElement;
  }

  /**
   * 新建canvas
   * 返回id
   *
   * @return  {string}  [return description]
   */
  private addCanvas(): string {
    const canvas = document.createElement('canvas');
    const canvasId = buildId();
    canvas.id = canvasId;
    DController.instance?.provider.appendChild(canvas);
    DController.instance?.insertDoms(canvas);
    return canvasId;
  }

  /**
   * 设置doms
   *
   * @param   {HTMLElement}  dom  [dom description]
   *
   * @return  {[type]}            [return description]
   */
  public insertDoms(dom: HTMLElement | HTMLCanvasElement) {
    if (DController.instance && dom.id) {
      DController.instance.doms.set(dom.id, dom);
    }
  }

  /**
   * 增加dom并返回这个节点
   *
   * @return  {[type]}  [return description]
   */
  public addDomRetEle() {
    const id = DController.instance?.addDom();
    if (!id) {
      return;
    }
    return DController.instance?.doms.get(id);
  }

  /**
   * 新增节点返回节点id
   *
   * @return  {string}  [return description]
   */
  public addDom(): string {
    const dom = document.createElement('div');
    const id = buildId();
    dom.id = id;
    DController.instance?.provider.appendChild(dom);
    DController.instance?.insertDoms(dom);
    return id;
  }
}

export const singletonDController = DController.getInstance();
