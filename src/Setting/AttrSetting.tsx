import gsap from 'gsap';
import { memo, useLayoutEffect, useRef } from 'react';
import { IAs } from '../store/slice/atterSlice.ts';
import { useSelector } from 'react-redux';
import { INs } from '../store/slice/nodeSlice.ts';
import { getAttrConfig, IConfig } from './signalNodeConfig.ts';
import { ILogicNode, ILs } from '../store/slice/logicSlice.ts';
import { useAttrSet } from './attrConfig/useAttrSet.tsx';
import { IPs } from '../store/slice/panelSlice.ts';
import { useSignalMsg } from '../comp/msg.tsx';


const DefaultSetting = memo(({ target }: { target: string[] }) => {
  const config = getAttrConfig();
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const { go } = useSignalMsg(logicState.target[0]);
  return <>{
    config.config.get('DEFAULT-LOGIC-PANEL-CONFIG')
    &&
    (config.config.get('DEFAULT-LOGIC-PANEL-CONFIG') as IConfig)({
      target,
      go,
    })
  }</>;
});

const SelectNodeInstance = memo(({
                                   target,
                                   logicNodes,
                                 }: {
  target: string[];
  logicNodes: Record<string, ILogicNode>
}) => {
  const config = getAttrConfig();
  const { go } = useSignalMsg(target[0]);

  return <>{
    (config.config.get(logicNodes[target[0]]?.typeId) as IConfig)({
      target,
      go,
    })
  }</>;
});

const SelectSetting = memo(() => {
  const config = getAttrConfig();
  const LogicNodesState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const { target, logicNodes } = LogicNodesState;

  return <>{
    target &&
    config.config.get(logicNodes[target[0]]?.typeId)
    &&
    <SelectNodeInstance target={target} logicNodes={logicNodes}></SelectNodeInstance>
  }</>;
});


const SelectSettingViewInstance = memo(({ NodesState }: {
  NodesState: INs
}) => {
  const config = getAttrConfig();
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const { go } = useSignalMsg(logicState.target[0]);
  const { targets } = NodesState;
  return <>
    {targets &&
      (config.viewConfig.get(NodesState.list[targets[0]]?.instance.type) as IConfig)({
        target: targets,
        go,
      })
    }
  </>;
});

const SelectSettingView = memo(() => {
  const config = getAttrConfig();
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  const { targets } = NodesState;
  return <>{
    config.viewConfig.get(NodesState.list[targets[0]]?.instance.type)
    &&
    <SelectSettingViewInstance NodesState={NodesState}></SelectSettingViewInstance>
  }</>;
});


const DefaultSettingView = memo(({
                                   targets,
                                 }: {
  targets: string[]
}) => {
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const { go } = useSignalMsg(logicState.target[0]);
  const config = getAttrConfig();
  return <>{
    config.viewConfig.get('DEFAULT-VIEW-PANEL-CONFIG')
    &&
    (config.viewConfig.get('DEFAULT-VIEW-PANEL-CONFIG') as IConfig)({
      target: targets,
      go,
    })
  }</>;
});
const SettingView = memo(() => {
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  const { targets } = NodesState;
  return <>
    {
      targets?.length > 0 ?
        <SelectSettingView></SelectSettingView>
        :
        <DefaultSettingView targets={targets}></DefaultSettingView>
    }
  </>;
});

const SettingTemp = memo(() => {
  const LogicNodesState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });


  const { target } = LogicNodesState;

  //逻辑元件目前只支持单独设置


  return <>
    {
      target?.length > 0 ?
        <SelectSetting></SelectSetting>
        :
        <DefaultSetting target={target}></DefaultSetting>
    }
  </>;


});

export const AttrSetting = memo(() => {

  useAttrSet();

  const gsapContainer = useRef<HTMLDivElement>(null);

  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    console.log(state, 'statescvsfv');
    return state.panelSlice;
  });
  const AttrState = useSelector((state: { viewNodesSlice: INs, attrSlice: IAs }) => {
    return state.attrSlice;
  });

  useLayoutEffect(() => {
    console.log(AttrState, 'AttrStatse');
    if (!AttrState.show) {
      gsap.to(gsapContainer.current, {
        width: '0px',
        maxWidth: '0px',
        minWidth: '0px',
        duration: 0.1,
        ease: 'none',
      });
    } else {
      gsap.to(gsapContainer.current, {
        maxWidth: '300px',
        minWidth: '300px',
        width: '300px',
        duration: 0.1,
        ease: 'none',
      });
    }
  }, [AttrState]);

  return (
    <div
      ref={gsapContainer}
      className="max-w-[300px] min-w-[300px] overflow-hidden"
    >
      {PanelState.currentSTab === 'logic' ? <SettingTemp /> : <SettingView />}

    </div>
  );
});
