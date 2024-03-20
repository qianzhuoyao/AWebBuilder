export const checkField = (str: string): boolean => {
  return !!/^[a-zA-Z0-9.]+$/.exec(str);
};

type IObjectNotNull<T, > = { [key: string]: IObjectNotNull<T> | T }

export const filterObjValue = <T, >(obj: IObjectNotNull<T>, keyString: string) => {

  if (!checkField(keyString)) {
    throw new Error('字段解析字符串不合法');
  }
  const path: string[] = keyString.split('.');

  const find = (index: number, object: IObjectNotNull<T>): IObjectNotNull<T> => {
    if (path[index]) {
      if (
        Object.keys(object).length
        &&
        object[path[index]] instanceof Object
      ) {
        return find(index + 1, object[path[index]] as IObjectNotNull<T>);
      } else {
        return object;
      }
    } else {
      return object;
    }
  };
  return find(0, obj);
};
console.log(filterObjValue<number>({ a: { b: { c: { d: 1 } } } }, 'a.b.c'));