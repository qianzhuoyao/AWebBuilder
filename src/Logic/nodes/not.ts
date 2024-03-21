import { signalLogicNode } from '../base.ts';
import { logic_NOT_BOTH_get } from '../../store/slice/nodeSlice.ts';
import notS from '../../assets/widgetIcon/ic--baseline-not-equal.svg';
import { filter, of, tap } from 'rxjs';
import { createSingleInstance } from '../../comp/createSingleInstance.ts';


const notTags = () => {
  const tagsIn = new Map<string, boolean>();
  return {
    tagsIn,
  };
};

export const getNotTags = createSingleInstance(notTags);

//检查器
export const not = () => {

  const Not = signalLogicNode<
    unknown,
    unknown,
    unknown
  >({
    id: logic_NOT_BOTH_get,
    type: 'both',
    src: notS,
    tips: '当收到错误信号时发送正常为null的信号,否则抛出异常Error传递',
    name: '非门',
  });
  Not.signalIn('in-not-0', (value) => {
    getNotTags().tagsIn.set(value.id, true);
    return of(1);
  });

  Not.signalOut('out-not', (value) => {

    return of(1).pipe(
      filter(() => {
        return !getNotTags().tagsIn.get(value.id);
      }),
      tap(() => {
        getNotTags().tagsIn.set(value.id, false);
      }),
    );
  });
};