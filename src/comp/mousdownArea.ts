/**
 * 判断点击是否在某个dom的范围内
 */
export const checkMouseDownInArea = (pointer: { x: number, y: number }, dom: HTMLElement | null) => {

  if (!dom) {
    return false;
  }
  const { x, y } = pointer;
  const { left, top, height, width } = dom.getBoundingClientRect();
  console.log(pointer,dom,left, top, height, width,'checkMouseDownInArea');
  return x >= left
    &&
    x <= left + width
    &&
    y >= top
    &&
    y <= top + height;
};