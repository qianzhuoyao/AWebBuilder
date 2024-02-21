/**
 *
 * 通过 baseLogicNode 来生成 逻辑节点
 * CustomNode = signalLogicNode()
 * CustomNode.signalIn()
 * CustomNode.signalIn()
 * CustomNode.signalOut()
 * const CustomNode =(in:any):any=>{
 *   // in
 *
 *   //
 * }
 *
 */
import { ILogicTypeList } from '../panel/logicSrcList.ts';
import { ILogicType } from '../store/slice/nodeSlice.ts';


interface IStreamData {
  fromNodes: {
    id: string;
    type: string
    data: any;
  };
}

//一段逻辑，必须线连接才生效
//in 阶段操作 out阶段传递数据
/**
 * 操作逻辑为
 * A连接B
 * A是一个定时器，10秒内5秒发送0 ；5s发送1
 * 此时 B的接收端10s内响应1信号，且B响应的操做必须是个Promise
 * 0.B不对一段时间进行长时间的操作（请求或者任何延时的或者读写的操作），上述例子，B接收端接收到A消息时，resolve promise的任务，执行
 * 当然，B是完全可以接收到全部的A发送来的信号的，只是说会在信号值不同时响应，
 * 1.如果要做到B定时的执行任务以响应A，则需要依赖额外的节点（频率器），强制完成对B任务接收但凡1信号时的定时操作
 *
 * const A = signalLogicNode('id1')
 * const B = signalLogicNode('id2')
 * //例子
 * A.signalIn('PORT-NAME-A1',(inData:{
 *   fromNode:{
 *     type:xxx
 *     name:xxx
 *   },
 *    data:any
 * }[])=>{
 *   xxx
 *   return new Promise(res=>{
 *     res([
 *       {
 *       data:inData
 *     }
 *     ])
 *   )
 * })
 * A.signalIn('PORT-NAME-A2',(inData:{
 *   fromNode:xxx，
 *   data:any
 * }[])=>{
 *   xxx
 *  return new Promise(res=>{
 *     res([
 *       {
 *       data:inData
 *     }
 *     ])
 *   )
 * })
 * })
 * runTask 是默认传入的函数，它表示执行当前逻辑节点的逻辑,合并所有的输入端，如果输入端不返回promise则返回空数组
 * 如果promiseres的数据不为数组则默认转化为数组
 * A.signalOut((inputList:any[])=>{
 *    return new Promise(res=>{
 *     res({
 *       data:inputList
 *     })
 *   )
 * })
 * })
 *
 * 连接B的PORT-NAME-B2 输入端口
 *
 * B.signalIn('PORT-NAME-B2',async (inData:{fromNode:xxx,data:any}[])=>{
 * //任务   log-a
 console.log('asdasdasdsa')
 * })
 *
 *
 * 当信号触发时候
 * 信号触发的操作为 - （自动，手动）
 * 自动包含 定时器
 * 手动包含 调试按钮d 与 事件捕获器e 与 周期捕获器c
 *
 *
 *  当 A 发送信号时候 ，自动执行所有连接上A 的 节点(B)
 *
 *  说明 关于 执行的优先级别 与 执行机制
 *
 *  所有任务存在权重，默认1 权重 需要额外调用函数更改
 *
 *  当 输入端接收大量的同权重信号时，按照收到时序执行，谁先来谁执行，异步操作
 *
 *  当 输入端接收大量的同权重信号时 并且存在一个阻塞任务（长时间）时，会一直等待，直到输入端收到0信号
 *
 *  如果需要并行任务（多线程不干扰） 就多建立几个节点 ，graph内节点不唯一，可多个同步执行存在命名空间，互不干扰
 *
 *  打印 asdasdasdsa
 * /
 /**
 * 输入端，接收输入的信号，并生成新信号传输给输出端
 */
type  IBuildInPort<T> = (streamData: IStreamData) => Promise<T>
/**
 * 输出端，接收多个输入端返回的信号并传递给下一个节点的输入端
 */
export type IBuildOutPort<T, K> = (streamData: T[]) => Promise<K>

export interface INodeInfo<I, O> {
  id: ILogicType;
  src: string;
  tips: string;
  name: string;
  ports: ({
    portName: string,
    type: 'isIn',
    make: IBuildInPort<I>,
  } | {
    type: 'isOut',
    make: IBuildOutPort<I, O>
  })[];
}

type INode<I, O> = Map<ILogicTypeList, INodeInfo<I, O>[]>

interface IMenu<I, O> {
  logicNodeMenuItems: INode<I, O>,
  logicNodeMenuIdList: Set<string>
}

const createLogicMenuInstance = <I, O>(initializer: () => IMenu<I, O>): (() => IMenu<I, O>) => {
  let instance: IMenu<I, O> | null = null;
  return () => {
    if (instance === null) {
      instance = initializer();
    }
    return instance;
  };
};

const initializeLogicNodeMenuItems = <I, O>(): {
  logicNodeMenuItems: INode<I, O>;
  logicNodeMenuIdList: Set<string>
} => {
  const initIdList = new Set<string>();
  const init = new Map<ILogicTypeList, INodeInfo<I, O>[]>();
  init.set('remote', []);
  init.set('cache', []);
  init.set('filter', []);
  return {
    logicNodeMenuIdList: initIdList,
    logicNodeMenuItems: init,
  };
};

export const genLogicNodeMenuItems = createLogicMenuInstance(initializeLogicNodeMenuItems);


export const signalLogicNode = <I, O>({
                                        tips, name,
                                        id, src, type,
                                      }: Omit<INodeInfo<I, O>, 'ports'> & {
  type: ILogicTypeList
}) => {

  const temps = genLogicNodeMenuItems() as IMenu<I, O>;

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


  const signalIn = (portName: string, buildInPort: IBuildInPort<I>) => {

    if (portName.indexOf('#') > -1) {
      throw new Error('端口名称不允许存在#');
    }

    const curNodes = temps.logicNodeMenuItems.get(type);
    console.log(curNodes, id, 'node222');


    const newCurNodes = curNodes?.map(node => {


      if (node.id === id) {
        return {
          ...node,
          ports: node.ports.concat([{
            type: 'isIn',
            portName: portName,
            make: buildInPort,
          }]),
        };
      }
      return node;
    });

    newCurNodes && temps.logicNodeMenuItems.set(type, newCurNodes);

  };
  const signalOut = (buildOutPort: IBuildOutPort<I, O>) => {

    const curNodes = temps.logicNodeMenuItems.get(type);
//建议只有一个
    const newCurNodes = curNodes?.map(node => {
      if (node.id === id) {
        return {
          ...node,
          ports: node.ports.concat([{
            type: 'isOut',
            make: buildOutPort,
          }]),
        };
      }
      return node;
    });

    newCurNodes && temps.logicNodeMenuItems.set(type, newCurNodes);
    console.log(temps, genLogicNodeMenuItems(), 'temps()');
  };


  return {
    signalIn,
    signalOut,
  };

};


// I intype O outtype

