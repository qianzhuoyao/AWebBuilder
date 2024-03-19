import { ILogicTypeList } from '../panel/logicSrcList.ts';
import { ILogicType } from '../store/slice/nodeSlice.ts';
import { Observable } from 'rxjs';


export interface INodeInfo {
  id: ILogicType;
  src: string;
  pickSrc?: string;
  tips: string;
  name: string;
  ports: ({
    id: string,
    portName: string,
    type: 'isIn' | 'isOut',
  })[];
}

type INode = Map<ILogicTypeList, INodeInfo[]>

interface IMenu<F> {
  logicNodeMenuItems: INode;
  logicNodeMenuIdList: Set<string>;
  initLogicInMake: Map<string, (v: F) => Observable<F>>;
  initLogicOutMake: Map<string, (v: F) => Observable<F>>;
}

const createLogicMenuInstance = <F>(initializer: () => IMenu<F>): (() => IMenu<F>) => {
  let instance: IMenu<F> | null = null;
  return () => {
    if (instance === null) {
      instance = initializer();
    }
    return instance;
  };
};

const initializeLogicNodeMenuItems = <F>(): IMenu<F> => {
  const initIdList = new Set<string>();
  const init = new Map<ILogicTypeList, INodeInfo[]>();
  init.set('remote', []);
  init.set('cache', []);
  init.set('filter', []);
  init.set('timeOut', []);
  init.set('mix', []);
  init.set('timeInter', []);
  init.set('hTrigger', []);
  init.set('page', []);
  init.set('viewSlot', []);

  const initLogicInMake: Map<string, (v: F) => Observable<F>> = new Map();
  const initLogicOutMake: Map<string, (v: F) => Observable<F>> = new Map();

  return {
    logicNodeMenuIdList: initIdList,
    logicNodeMenuItems: init,
    initLogicInMake,
    initLogicOutMake,
  };
};


export const genLogicNodeMenuItems = createLogicMenuInstance(initializeLogicNodeMenuItems);


export const signalLogicNode = <F>({
                                     tips, name,
                                     id, src, type,
                                   }: Omit<INodeInfo, 'ports'> & {
  type: ILogicTypeList
}) => {

  const temps = genLogicNodeMenuItems() as IMenu<F>;

  if (!temps.logicNodeMenuItems.has(type)) {
    throw TypeError('分区不存在');
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


  const signalIn = (portName: string, buildInPort: (v: F) => Observable<F>) => {

    if (portName.indexOf('#') > -1 || portName.indexOf('@') > -1) {
      throw new Error('端口名称不允许存在#@');
    }

    const curNodes = temps.logicNodeMenuItems.get(type);


    const newCurNodes = curNodes?.map(node => {


      if (node.id === id) {
        return {
          ...node,
          ports: node.ports.concat([{
            type: 'isIn',
            id: id + '@' + portName,
            portName: portName,
          }]),
        };
      }
      return node;
    });
    temps.initLogicInMake.set(id + '@' + portName, buildInPort);
    newCurNodes && temps.logicNodeMenuItems.set(type, newCurNodes);

  };
  const signalOut = (portName: string, buildOutPort: (v: F) => Observable<F>) => {
    const curNodes = temps.logicNodeMenuItems.get(type);
    const newCurNodes = curNodes?.map(node => {
      if (node.id === id) {
        return {
          ...node,
          ports: node.ports.concat([{
            type: 'isOut',
            id: id + '@' + portName,
            portName: portName,
          }]),
        };
      }
      return node;
    });
    temps.initLogicOutMake.set(id + '@' + portName, buildOutPort);
    newCurNodes && temps.logicNodeMenuItems.set(type, newCurNodes);
    console.log(temps, genLogicNodeMenuItems(), 'temps()');
  };


  return {
    signalIn,
    signalOut,
  };

};


// I intype O outtype

