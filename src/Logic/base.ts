import { ILogicTypeList } from "../panel/logicSrcList.ts";
import { ILogicType } from "../store/slice/nodeSlice.ts";
import { Observable } from "rxjs";
import { IMessageFromStream } from "../comp/signal3.ts";

export interface INodeInfo {
  id: ILogicType;
  src: string;
  pickSrc?: string;
  tips: string;
  name: string;
  ports: {
    id: string;
    portName: string;
    type: "isIn" | "isOut";
  }[];
}

type INode = Map<ILogicTypeList, INodeInfo[]>;

interface IMenu<Pre, F, I, O> {
  logicNodeMenuItems: INode;
  logicNodeMenuIdList: Set<string>;
  initLogicInMake: Map<
    string,
    (v: IMessageFromStream<Pre, F>) => Observable<I>
  >;
  initLogicOutMake: Map<
    string,
    (v: IMessageFromStream<Pre, F>) => Observable<O>
  >;
}

const createLogicMenuInstance = <Pre, F, I, O>(
  initializer: () => IMenu<Pre, F, I, O>
): (() => IMenu<Pre, F, I, O>) => {
  let instance: IMenu<Pre, F, I, O> | null = null;
  return () => {
    if (instance === null) {
      instance = initializer();
    }
    return instance;
  };
};

const initializeLogicNodeMenuItems = <Pre, F, I, O>(): IMenu<Pre, F, I, O> => {
  const initIdList = new Set<string>();
  const init = new Map<ILogicTypeList, INodeInfo[]>();
  init.set("remote", []);
  init.set("cache", []);
  init.set("filter", []);
  init.set("timeOut", []);
  init.set("mix", []);
  init.set("timeInter", []);
  init.set("hTrigger", []);
  init.set("page", []);
  init.set("viewSlot", []);
  init.set("date", []);
  init.set("both", []);
  const initLogicInMake: Map<
    string,
    (v: IMessageFromStream<Pre, F>) => Observable<I>
  > = new Map();
  const initLogicOutMake: Map<
    string,
    (v: IMessageFromStream<Pre, F>) => Observable<O>
  > = new Map();

  return {
    logicNodeMenuIdList: initIdList,
    logicNodeMenuItems: init,
    initLogicInMake,
    initLogicOutMake,
  };
};

export const genLogicNodeMenuItems = createLogicMenuInstance(
  initializeLogicNodeMenuItems
);

export const signalLogicNode = <F, I, O>({
  tips,
  name,
  id,
  src,
  type,
}: Omit<INodeInfo, "ports"> & {
  type: ILogicTypeList;
}) => {
  const temps = genLogicNodeMenuItems() as IMenu<unknown, F, I, O>;

  if (!temps.logicNodeMenuItems.has(type)) {
    throw TypeError("分区不存在");
  }

  if (!temps.logicNodeMenuIdList.has(id)) {
    temps.logicNodeMenuIdList.add(id);
    temps.logicNodeMenuItems.get(type)?.push({
      id,
      src,
      tips,
      name,
      ports: [],
    });
  }

  const signalIn = <Pre>(
    portName: string,
    buildInPort: (v: IMessageFromStream<Pre, F>) => Observable<I>
  ) => {
    const tempsIn = genLogicNodeMenuItems() as IMenu<Pre, F, I, O>;
    if (portName.indexOf("#") > -1 || portName.indexOf("@") > -1) {
      throw new Error("端口名称不允许存在#@");
    }

    const curNodes = tempsIn.logicNodeMenuItems.get(type);

    const newCurNodes = curNodes?.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          ports: node.ports.concat([
            {
              type: "isIn",
              id: id + "@" + portName,
              portName: portName,
            },
          ]),
        };
      }
      return node;
    });
    tempsIn.initLogicInMake.set(id + "@" + portName, buildInPort);
    newCurNodes && tempsIn.logicNodeMenuItems.set(type, newCurNodes);
  };
  const signalOut = <Pre>(
    portName: string,
    buildOutPort: (v: IMessageFromStream<Pre, F>) => Observable<O>
  ) => {
    const tempsOut = genLogicNodeMenuItems() as IMenu<Pre, F, I, O>;

    const curNodes = tempsOut.logicNodeMenuItems.get(type);
    const newCurNodes = curNodes?.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          ports: node.ports.concat([
            {
              type: "isOut",
              id: id + "@" + portName,
              portName: portName,
            },
          ]),
        };
      }
      return node;
    });
    tempsOut.initLogicOutMake.set(id + "@" + portName, buildOutPort);
    newCurNodes && tempsOut.logicNodeMenuItems.set(type, newCurNodes);
  };

  return {
    signalIn,
    signalOut,
  };
};

// I intype O outtype
