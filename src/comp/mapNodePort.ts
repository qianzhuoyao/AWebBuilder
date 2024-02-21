import { genLogicNodeMenuItems } from '../Logic/base.ts';
import { ILogicNode } from '../store/slice/logicSlice.ts';

/**
 * 将节点映射出端口
 */
export const mapNodeBindPort = (node: Pick<ILogicNode, 'belongClass' | 'typeId'>) => {
  const { belongClass, typeId } = node;
  const { logicNodeMenuItems } = genLogicNodeMenuItems();
  const classify = logicNodeMenuItems.get(belongClass);
  let res:any= null;
  if (classify) {
    classify.some(classifyItem => {
      if (classifyItem.id === typeId) {
        res = classifyItem;
        return true;
      }
    });
  }
  return res;
};
