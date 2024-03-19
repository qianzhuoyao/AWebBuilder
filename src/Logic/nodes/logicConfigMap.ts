import { createSingleInstance } from '../../comp/createSingleInstance.ts';

export interface IBar {
  x: string;
  y: string;
}

export type IInstanceBind = IBar

export type IProtocol = 'https' | 'http';

export interface IFilterListInfo {
  type: 'IFilterListInfo',
  logic: string
}

export interface ITimerConfigInfo {
  time: number;
}

export interface ITimerOutConfigInfo {
  timeOut: number;
}

export interface IMixDataFieldMap {
  type: 'IMixDataFieldMap',
  fieldString: string
}


export interface IViewMapInfo {
  viewNodeId: string;
  data: any;
}

export interface IRemoteReqInfo {
  url: string;
  protocol: IProtocol;
  method: 'post' | 'get';
}


export interface IConfigInfo {
  remoteReqInfo?: IRemoteReqInfo;
  viewMapInfo?: IViewMapInfo;
  mixDataFieldMap?: IMixDataFieldMap;
  filterListInfo?: IFilterListInfo;
  timerConfigInfo?: ITimerConfigInfo;
  timerOutConfigInfo?: ITimerOutConfigInfo;
}

const logicConfigMap = () => {
  const configInfo = new Map<string, IConfigInfo>();
  return {
    configInfo,
  };
};
export const genLogicConfigMap = createSingleInstance(logicConfigMap);