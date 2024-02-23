import { signalLogicNode } from '../base.ts';
import { logic_Cache_clear } from '../../store/slice/nodeSlice.ts';
import cacheRemove from '../../assets/widgetIcon/cache-delete.svg';

interface IDataReq {
  data: number;
}

export const buildCacheClearReqNode = () => {

  const cacheClearReq = signalLogicNode<IDataReq, IDataReq>({
    id: logic_Cache_clear,
    type: 'cache',
    src: cacheRemove,
    tips: '清除所有缓存以便释放内存',
    name: '缓存清理器',
  });
  cacheClearReq.signalIn('in-0', ({ fromNodes }) => {
    console.log({
      fromNodes,
    });
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });

  cacheClearReq.signalOut((params) => {
    console.log({
      params,
    });
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });

};