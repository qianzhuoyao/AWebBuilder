import { generateCoordinateSystem, toSplit } from '../Layout/coordinateSystem';

// eslint-disable-next-line no-undef
test('toSplit 切分数数组1,从0到5,分成5份', () => {
  // eslint-disable-next-line no-undef
  expect(toSplit(0, 1, 5)).toStrictEqual([0, 1, 2, 3, 4]);
});

test('toSplit 切分数数组0,从0到5,分成5份', () => {
  // eslint-disable-next-line no-undef
  expect(toSplit(0, 0, 5)).toStrictEqual([]);
});

test('toSplit 切分数数组-1,从0到5,分成5份', () => {
  // eslint-disable-next-line no-undef
  expect(toSplit(0, -1, 5)).toStrictEqual([]);
});


test('等分长宽', () => {
  // eslint-disable-next-line no-undef
  expect(generateCoordinateSystem({
    width:5,
    height:5,
    unitSize:1
  })).toStrictEqual({
    x:[0, 1, 2, 3, 4],
    y:[0, 1, 2, 3, 4]
  });
});
