export const checkField = (str: string): boolean => {
  return !!/^[a-zA-Z0-9.]+$/.exec(str);
};
export const filterObjValue = (obj: Record<string, any>, keyString: string) => {

  if (!checkField(keyString)) {
    throw new Error('字段解析字符串不合法');
  }
  const path: string[] = keyString.split('.');
  let curValue: any = obj;
  path.map(p => {
    if (!curValue) {
      throw new Error('字段解析字符串不合法,存在中断');
    }
    curValue = curValue[p];
  });

  return curValue;
};