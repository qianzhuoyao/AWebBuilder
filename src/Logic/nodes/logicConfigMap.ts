import { createSingleInstance } from "../../comp/createSingleInstance.ts";

export interface IBar {
  x: string;
  y: string;
}

export type IInstanceBind = IBar;

export type IProtocol = "https" | "http";

export interface IFilterListInfo {
  type: "IFilterListInfo";
  logic: string;
}

export interface ITimerConfigInfo {
  time: number;
}

export interface IFormConfigInfo<T> {
  json: T;
  mergePre?: boolean;
}

export const ENCRYPTION_METHODS = ["MD5", "AES"] as const;

export interface IEncryptionConfigInfo {
  encryptionMethod: (typeof ENCRYPTION_METHODS)[number];
  publicKey: string;
}

export interface ITimerOutConfigInfo {
  timeOut: number;
}

export interface IMixDataFieldMap {
  fieldString: string;
}

export interface IViewMapInfo<T> {
  viewNodeId: string;
  data: T;
}

export interface IRemoteReqInfo {
  url: string;
  protocol: IProtocol;
  method: "post" | "get";
}

export interface IConfigInfo {
  remoteReqInfo?: IRemoteReqInfo;
  viewMapInfo?: IViewMapInfo<unknown>;
  mixDataFieldMap?: IMixDataFieldMap;
  filterListInfo?: IFilterListInfo;
  timerConfigInfo?: ITimerConfigInfo;
  formConfigInfo?: IFormConfigInfo<object>;
  timerOutConfigInfo?: ITimerOutConfigInfo;
  encryptionConfigInfo?: IEncryptionConfigInfo;
}

const logicConfigMap = () => {
  const configInfo = new Map<string, IConfigInfo>();
  return {
    configInfo,
  };
};
export const genLogicConfigMap = createSingleInstance(logicConfigMap);
export const genLogicConfigMapToJSON = () => {
  const target: Record<string, IConfigInfo | null> = {};
  [...genLogicConfigMap().configInfo.keys()].map((key) => {
    target[key] = genLogicConfigMap().configInfo.get(key) || null;
  });
  return JSON.stringify(target);
};
export const genLogicConfigMapToParse = (MapJSON: string) => {
  const target = JSON.parse(MapJSON);
  Object.keys(target).map((key) => {
    genLogicConfigMap().configInfo.set(key, target[key]);
  });
};
