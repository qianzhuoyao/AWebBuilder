/**
 * 坐标系
 */
export interface ICoordinateSystemParams {
  width: number;
  height: number;
  unitSize: number;
}

export type ICoordinateSystem = {
  x: number[];
  y: number[];
};

/**
 * 将某段数据切分数组
 *
 * @param   {number}    cur   [cur description]
 * @param   {number}    unit  [unit description]
 * @param   {number[]}  max   [max description]
 *
 * @return  {number[]}        [return description]
 */
export const toSplit = (cur: number, unit: number, max: number): number[] => {
  const res: number[] = [];
  if (unit <= 0) {
    return [];
  }
  while (cur <= max) {
    res.push(cur);
    cur += unit;
  }

  return res;
};

/**
 * 将某个平面划分成x与y轴的数组
 *
 * @param   {ICoordinateSystemParams}  params  [params description]
 *
 * @return  {ICoordinateSystem}                [return description]
 */
export const generateCoordinateSystem = (params: ICoordinateSystemParams): ICoordinateSystem => {
  const { width, height, unitSize } = params;

  return {
    x: toSplit(0, unitSize, width),
    y: toSplit(0, unitSize, height),
  };
};
