export const arrayToGenObj = (objList: {
  key: string,
  value: string
}[]) => {
  const O: Record<string, string> = {};
  if (objList.length === 0) {
    return O;
  }
  objList.map(item => {
    O[item.key] = item.value;
  });
  return O;
};


/**
 *
 * @param obj
 * 0 不可解析为key的类型
 */
export const objToGenArray = (obj?: Record<string, any>) => {
  console.log(obj,'cobj');
  if (!obj) {
    return {
      type: 0,
      result: undefined,
    };
  }
  if (!Object.values(obj).some(value => typeof value === 'string')) {
    return {
      type: 0,
      result: undefined,
    };
  }
  const res: {
    key: string,
    value: string
  }[] = [];
  Object.keys(obj).map(key => {
    const o: { key?: string, value?: string } = {};
    o.key = key;
    o.value = obj[key];
    res.push(o as {
      key: string,
      value: string
    });
  });
  return {
    type: 1,
    result: res,
  };
};