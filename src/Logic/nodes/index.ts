import { buildDataReqNode } from './remoteGet.ts';
import { buildDataSyncNode } from './remoteSync.ts';
import { buildCacheClearReqNode } from './cacheRemove.ts';
import { buildCacheSetNode } from './cacheSet.ts';

export const nodeBuilder = () => {
  buildDataReqNode();
  buildDataSyncNode();
  buildCacheClearReqNode();
  buildCacheSetNode();
};
