import { signalLogicNode } from '../base.ts';
import { logic_Cache_set } from '../../store/slice/nodeSlice.ts';
import cacheSet from '../../assets/widgetIcon/cache-storage.svg';

interface IDataReq {
  data: number;
}

export const buildCacheSetNode = () => {

  const CacheSet = signalLogicNode<IDataReq, IDataReq>({
    id: logic_Cache_set,
    type: 'cache',
    src: cacheSet,
    tips: '获取来自服务器上的数据',
    name: '缓存设置器',
  });
  CacheSet.signalIn('in-0', ({ fromNodes }) => {
    console.log({
      fromNodes,
    });
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });

  CacheSet.signalOut((params) => {
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