import { buildDataReqNode } from "./remoteGet.ts";
import { buildCacheClearReqNode } from "./cacheRemove.ts";
import { buildCacheSetNode } from "./cacheSet.ts";
import { checkPassword } from "./checkPass.ts";
import { timeOut } from "./timeout.ts";
import { timeInter } from "./timeInt.ts";
import { handleTrigger } from "./handleTrigger.ts";
import { viewLogicSlot } from "./viewSlotBind.ts";
import { filterMixData } from "./filterData.ts";
import { timeSetter } from "./timesSet.ts";
import { rollPick } from "./roll.ts";
import { takeForm } from "./takeForm.ts";
import { loadStart } from "./loadStart.ts";
import { encryption } from "./encryption.ts";
import { and } from "./and.ts";
import { or } from "./or.ts";
import { not } from "./not.ts";
import { checkFilter } from "./checkFilter.ts";
import { mapFieldMixData } from './selectKeyMix.ts'
import { handleGetDate } from "./day.tsx";

export const nodeBuilder = () => {
  buildCacheClearReqNode();
  buildDataReqNode();
  not();
  or();
  and();
  mapFieldMixData();
  checkFilter();
  filterMixData();
  checkPassword();
  buildCacheSetNode();
  timeSetter();
  handleGetDate()
  encryption();
  loadStart();
  rollPick();
  timeOut();
  takeForm();
  timeInter();
  handleTrigger();
  viewLogicSlot();
};

