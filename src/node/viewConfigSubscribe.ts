import { ReplaySubject } from "rxjs";
import { createSingleInstance } from "../comp/createSingleInstance.ts";

export interface ITableConfig {
  colField: string;
  colLabel: string;
  colProp: string;
  dataField: string;
}

type IChartConfig = { config: string };
type IConfig = Partial<ITableConfig & IChartConfig>;

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
