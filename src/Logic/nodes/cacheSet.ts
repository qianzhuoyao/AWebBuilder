import { signalLogicNode } from '../base.ts';
import { logic_Cache_set } from '../../store/slice/nodeSlice.ts';
import cacheSet from '../../assets/widgetIcon/cache-storage.svg';


export const buildCacheSetNode = () => {

  const CacheSet = signalLogicNode({
    id: logic_Cache_set,
    type: 'cache',
    src: cacheSet,
    tips: '获取来自服务器上的数据',
    name: '缓存设置器',
  });




};