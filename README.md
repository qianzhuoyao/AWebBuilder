0：这是一个开箱即用的低代码项目

- 0:注册右侧菜单 （signalLogicNode）
```tsx
import { signalLogicNode } from '../base.ts';
import { logic_Cache_clear } from '../../store/slice/nodeSlice.ts';
import cacheRemove from '../../assets/widgetIcon/cache-delete.svg';

interface IDataReq {
  data: number;
}

export const buildCacheClearReqNode = () => {

  const cacheClearReq = signalLogicNode<IDataReq, IDataReq>({
  //必须预先注册一个关于组件的声明id，这个id在nodeSlice内注册
    id: logic_Cache_clear,
    //类型需要声明所属范围
    type: 'cache',
    //资源文件，用于放置图标
    src: cacheRemove,
    //组件说明
    tips: '清除所有缓存以便释放内存',
    //组件名称
    name: '缓存清理器',
  });
  //注册入端口，会在使用逻辑流时执行。默认为一个任务，参数是，来源节点信息
  cacheClearReq.signalIn('logic_Cache_clear-port-in-0', ({ fromNodes }) => {
    console.log({
      fromNodes,
    });
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });
//注册输出端，输出端只允许一个端口，可以连接多个，参数是in接口返回的promise数据
  cacheClearReq.signalOut((params) => {
    console.log({
      params,
    });
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });
  
};
```
- 注册配置项 (signalLogicNodeAttrConfig)
```tsx
export const remoteGetConfig = () => {
  //DEFAULT-LOGIC-PANEL-CONFIG 表示点击空白面板
  //参数 logic_D_get 就是组件注册的id
  const config = signalLogicNodeAttrConfig(logic_D_get);
  //nodeInfo 的target 是数组，表面 允许多选
  config.setConfigEle(nodeInfo => {
    if (nodeInfo.target.length > 0) {
      return <>
       xxx
      </>;
    }
  });
};
```

- 开启逻辑路径(useSignalMsg)
```tsx
export const setDefaultLogicConfig = () => {
  //signalLogicNodeAttrConfig 是注册 组件 配置项组件
  //
  const config = signalLogicNodeAttrConfig('DEFAULT-LOGIC-PANEL-CONFIG');
 //setConfigEle 返回一个JSX.Element，用于插入组件
  config.setConfigEle(() => {
    const logicState = useSelector((state: { logicSlice: ILs }) => {
      return state.logicSlice;
    });

    //他会寻找此点存在于逻辑图上的路径，从而执行逻辑节点上的任务
    const { go } = useSignalMsg(Object.keys(logicState.logicNodes)[0]);
    const handleClick = () => {
      go();
    };

    console.log(logicState, genLogicNodeMenuItems(), 'cascascascascasc');
    return <div onClick={handleClick}>333333</div>;
  });
};

```