import { buildDataReqNode } from './remoteGet.ts';
import { buildDataSyncNode } from './remoteSync.ts';
import { buildCacheClearReqNode } from './cacheRemove.ts';
import { buildCacheSetNode } from './cacheSet.ts';
import { changeSignal } from './change.ts';
import { checkPassword } from './checkPass.ts';
import { timeOut } from './timeout.ts';
import { timeInter } from './timeInt.ts';
import { handleTrigger } from './handleTrigger.ts';
import { viewLogicSlot } from './viewSlotBind.ts';
import { filterMixData } from './filterData.ts';
import { mapFieldMixData } from './selectKeyMix.ts';
import { timeSetter } from './timesSet.ts';
import { useEffect } from 'react';
import { rollPick } from './roll.ts';
import { takeForm } from './takeForm.ts';
import { loadStart } from './loadStart.ts';
import { encryption } from './encryption.ts';
import { and } from './and.ts';
import { or } from './or.ts';
import { not } from './not.ts';

export const nodeBuilder = () => {

  buildDataReqNode();
  not();
  or();
  and();
  // buildDataSyncNode();
  // buildCacheClearReqNode();
  // buildCacheSetNode();
  // changeSignal();
  // filterMixData();
  // checkPassword();
  encryption();
  loadStart();
  rollPick();
  timeOut();
  takeForm();
  timeInter();
  handleTrigger();
  viewLogicSlot();
  // mapFieldMixData();
  // timeSetter()
};
