import { PANEL_MAIN_BG } from '../contant';

/**
 * 更具元素，计算建立在坐标系下的坐标
 */
export const computeActPositionNodeByRuler = (node: HTMLElement | SVGElement, unit: number) => {
  const panelDom = document.getElementById(PANEL_MAIN_BG);
  if (panelDom) {
    const { left, top } = panelDom.getBoundingClientRect();
    const { left: Nleft, top: Ntop } = node.getBoundingClientRect();
    return {
      x: (Nleft - left) * unit,
      y: (Ntop - top) * unit,
    };
  }
  return undefined;
};