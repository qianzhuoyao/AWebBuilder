// import {
//   Card,
//   Tabs,
//   CardBody,
//   Tab,
//   Tooltip,
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
//   Button,
//   Switch,
// } from '@nextui-org/react';
// import { SketchPicker } from 'react-color';
import gsap from 'gsap';
// import { Icon } from '@iconify-icon/react';
// import { AInput } from '../comp/AInput.tsx';
import { memo, useEffect, useLayoutEffect, useRef } from 'react';
import { IAs } from '../store/slice/atterSlice.ts';
import { useSelector } from 'react-redux';
// import {
//   IPs,
//   updatePanelLockTransform,
//   updatePanelLockScale,
// } from '../store/slice/panelSlice.ts';
import { INs } from '../store/slice/nodeSlice.ts';
import { AttrConfigInit, setDefaultLogicConfig } from './attrConfig';
import { getAttrConfig, IConfig } from './signalNodeConfig.ts';
import { ILs } from '../store/slice/logicSlice.ts';

// const ColorPick = memo(() => {
//   return (
//     <Popover placement="bottom" showArrow offset={10}>
//       <PopoverTrigger>
//         <div className="flex items-center">
//           <small className="w-[30px]">颜色</small>
//           <AInput
//             placeholder="颜色"
//             className="w-[100%] rounded-md"
//             size="xs"
//             radius="md"
//           />
//         </div>
//       </PopoverTrigger>
//       <PopoverContent className="w-[230px]">
//         {() => (
//           <div className="px-1 py-2 w-full">
//             <SketchPicker />
//           </div>
//         )}
//       </PopoverContent>
//     </Popover>
//   );
// });

// const PanelSetting = memo(() => {
//   const dispatch = useDispatch();
//   const PanelState = useSelector((state: { panelSlice: IPs }) => {
//     console.log(state, 'statescvsfv');
//     return state.panelSlice;
//   });
//
//   return (
//     <div>
//       <div className="flex items-center">
//         <span>锁定画布位移:</span>
//         <Switch
//           size="sm"
//           className="ml-2"
//           aria-label="Automatic updates"
//           checked={PanelState.lockTransform}
//           onChange={(e) => {
//             dispatch(updatePanelLockTransform(e.target.checked));
//           }}
//         />
//       </div>
//       <div className="flex items-center  mt-2">
//         <span>锁定画布缩放:</span>
//         <Switch
//           size="sm"
//           className="ml-2"
//           aria-label="Automatic updates"
//           checked={PanelState.lockScale}
//           onChange={(e) => {
//             dispatch(updatePanelLockScale(e.target.checked));
//           }}
//         />
//       </div>
//
//       <div className="flex items-center mt-2">
//         <span>刻度颗粒度:</span>
//         <AInput
//           placeholder="刻度颗粒度"
//           className="w-[130px] ml-2 rounded-md"
//           size="xs"
//           radius="md"
//         />
//       </div>
//       <div className="flex items-center mt-2">
//         <span>单位鼠标滚动缩放颗粒度:</span>
//         <AInput
//           placeholder="刻度颗粒度"
//           className="w-[130px] ml-2 rounded-md"
//           size="xs"
//           radius="md"
//         />
//       </div>
//       <div className="flex items-center mt-2">
//         <span className="flex items-center">
//           聚焦设置
//           <Tooltip
//             color={'default'}
//             content={'将视角聚焦至某点,并将其放置于左上角'}
//             placement="top"
//             className="capitalize"
//           >
//             <Icon icon="ph:question" className="cursor-pointer" />
//           </Tooltip>
//           :
//         </span>
//         <div className="flex items-center">
//           <AInput
//             placeholder="x"
//             className="w-[50px] ml-2 rounded-md"
//             size="xs"
//             radius="md"
//           />
//           <AInput
//             placeholder="y"
//             className="w-[50px] ml-2 rounded-md"
//             size="xs"
//             radius="md"
//           />
//         </div>
//       </div>
//     </div>
//   );
// });

// const DefaultPanelSetting = memo(() => {
//   return (
//     <Card className="max-w-[300px] min-w-[300px]  rounded-none overflow-hidden h-full">
//       <CardBody>
//         <div className="flex w-full flex-col">
//           <Tabs aria-label="Dynamic tabs" items={tabs}>
//             {(item) => (
//               <Tab key={item.id} title={item.label}>
//                 <Card>
//                   <CardBody>{item.content}</CardBody>
//                 </Card>
//               </Tab>
//             )}
//           </Tabs>
//         </div>
//       </CardBody>
//     </Card>
//   );
// });

// const ProviderSetting = memo(() => {
//   return (
//     <div>
//       <div className="flex">
//         <div className="flex items-center">
//           <small className="w-[30px]">长</small>
//           <AInput
//             placeholder="长"
//             className="w-[80px] mr-2 rounded-md"
//             size="xs"
//             radius="md"
//           />
//         </div>
//         <div className="flex items-center">
//           <small className="w-[30px]">宽</small>
//           <AInput
//             placeholder="宽"
//             className="w-[80px] rounded-md"
//             size="xs"
//             radius="md"
//           />
//         </div>
//       </div>
//       <div className="flex mt-2">
//         <div className="flex items-center">
//           <small className="w-[30px]">x</small>
//           <AInput
//             placeholder="x"
//             className="w-[80px] mr-2 rounded-md"
//             size="xs"
//             radius="md"
//           />
//         </div>
//         <div className="flex items-center">
//           <small className="w-[30px]">y</small>
//           <AInput
//             placeholder="y"
//             className="w-[80px] rounded-md"
//             size="xs"
//             radius="md"
//           />
//         </div>
//       </div>
//       <div className="flex justify-center py-3">
//         <div className="flex flex-col items-center">
//           <Icon
//             className="cursor-pointer"
//             icon="icon-park-twotone:upload-web"
//             height={130}
//             width={130}
//           />
//           <small className="text-zinc-500 text-center">
//             容器背景,上传大小最大500kb,格式PNG/JPG
//           </small>
//         </div>
//       </div>
//       <div>
//         <ColorPick></ColorPick>
//       </div>
//       <div className="flex mt-2 items-center">
//         <small className="w-[80px]">背景控制</small>
//         <div className="flex">
//           <Button size="sm" className="mr-2">
//             清除背景图片
//           </Button>
//           <Button size="sm">清除背景颜色</Button>
//         </div>
//       </div>
//       <div className="flex mt-2 items-center">
//         <small className="w-[80px]">边界控制</small>
//         <div className="flex">
//           <Tabs
//             size={'sm'}
//             aria-label="Tabs sizes"
//             defaultSelectedKey={'bound'}
//           >
//             <Tab key="bound" title="控制覆盖" />
//             <Tab key="over" title="溢出隐藏" />
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// });

// const nodeTabs = [
//   {
//     id: 'panel',
//     label: '组件设置',
//     content: <PanelSetting></PanelSetting>,
//   },
// ];

// const DefaultNodeSetting = memo(() => {
//   return (
//     <Card className="max-w-[300px] min-w-[300px]  rounded-none overflow-hidden h-full">
//       <CardBody>
//         <div className="flex w-full flex-col">
//           <Tabs aria-label="Dynamic tabs" items={nodeTabs}>
//             {(item) => (
//               <Tab key={item.id} title={item.label}>
//                 <Card>
//                   <CardBody>{item.content}</CardBody>
//                 </Card>
//               </Tab>
//             )}
//           </Tabs>
//         </div>
//       </CardBody>
//     </Card>
//   );
// });
// const tabs = [
//   {
//     id: 'panel',
//     label: '面板设置',
//     content: <PanelSetting></PanelSetting>,
//   },
//   {
//     id: 'page',
//     label: '容器配置',
//     content: <ProviderSetting></ProviderSetting>,
//   },
// ];


const DefaultSetting = memo(({ target }: { target: string[] }) => {
  const config = getAttrConfig();
  return <>{
    config.config.get('DEFAULT-LOGIC-PANEL-CONFIG')
    &&
    (config.config.get('DEFAULT-LOGIC-PANEL-CONFIG') as IConfig)({
      target,
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
    config.config.get(logicNodes[target[0]]?.typeId)
    &&
    (config.config.get(logicNodes[target[0]]?.typeId) as IConfig)({
      target,
    })
  }</>;
});

const SettingTemp = memo(() => {
  const LogicNodesState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });


  const { target } = LogicNodesState;

  //逻辑元件目前只支持单独设置


  return <>
    {
      target.length > 0 ?
        <SelectSetting></SelectSetting>
        :
        <DefaultSetting target={target}></DefaultSetting>
    }
  </>;


});

export const AttrSetting = memo(() => {

  useEffect(() => {
    setDefaultLogicConfig();
    AttrConfigInit();
  }, []);

  const gsapContainer = useRef<HTMLDivElement>(null);


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
      <SettingTemp></SettingTemp>
    </div>
  );
});