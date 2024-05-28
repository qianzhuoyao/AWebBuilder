import { ReplaySubject } from "rxjs";
import { createSingleInstance } from "../comp/createSingleInstance.ts";

export interface ITableConfig {
  colField: string;
  colLabel: string;
  colProp: string;
  dataField: string;
}

type IChartConfig = { chart: string };
type IImageConfig = { src: string };
type I3dConfig = { A3durl: string };
export type IText = {
  text: string;
  color: string;
  fontSize: string;
  fontWeight: number;
  fontFamily: string;
};
export type IConfig = Partial<
  ITableConfig & IChartConfig & IImageConfig & IText & I3dConfig
>;

const configSubscribe = () => {
  const nodeConfig = new Map<string, IConfig>();
  const observable = new ReplaySubject<IConfig & { id: string }>();
  return {
    nodeConfig,
    observable,
  };
};

export const getConfigSubscribe = createSingleInstance(configSubscribe);

export const insertConfig = (id: string, config: IConfig) => {
  console.log(config,{ id, ...config }, "configsssss");
  getConfigSubscribe().observable.next({ id, ...config });
  getConfigSubscribe().nodeConfig.set(id, config);
};

export const getNodeConfig = (id: string) => {
  return getConfigSubscribe().nodeConfig.get(id);
};

export const subscribeConfig = (
  subscribe: (value: IConfig & { id?: string }) => void
) => {
  return getConfigSubscribe().observable.subscribe(subscribe);
};
export const viewNodesToJSON = () => {
  const target: Record<string, IConfig | ""> = {};
  [...getConfigSubscribe().nodeConfig.keys()].map((key) => {
    target[key] = getNodeConfig(key) || "";
  });
  return JSON.stringify(target);
};
