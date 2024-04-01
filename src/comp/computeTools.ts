export const arrayToGenObj = (
  objList: {
    key: string;
    value: string;
  }[]
) => {
  const O: Record<string, string> = {};
  if (objList.length === 0) {
    return O;
  }
  objList.map((item) => {
    O[item.key] = item.value;
  });
  return O;
};

/**
 *
 * @param obj
 * 0 不可解析为key的类型
 */
export const objToGenArray = <T>(obj?: Record<string, T>) => {
  if (!obj) {
    return {
      type: 0,
      result: undefined,
    };
  }
  if (!Object.values(obj).some((value) => typeof value === "string")) {
    return {
      type: 0,
      result: undefined,
    };
  }
  const res: {
    key: string;
    value: T;
  }[] = [];
  Object.keys(obj).map((key) => {
    res.push({
      key,
      value: obj[key],
    });
  });
  return {
    type: 1,
    result: res,
  };
};
