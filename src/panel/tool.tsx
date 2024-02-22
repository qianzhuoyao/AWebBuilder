// import { Icon } from '@iconify-icon/react';
import { Tabs, Tab, Card, CardBody, Button } from '@nextui-org/react';
import { AInput } from '../comp/AInput';
import gsap from 'gsap';
import { WidgetMenu } from './widgetMenu';
import { useSelector, useDispatch } from 'react-redux';
import { IAs, updateAttrShow } from '../store/slice/atterSlice';
import {
  IWs,
  updateContentImageShowType,
  updateProviderShow,
  updateWidgetMapShow,
} from '../store/slice/widgetMapSlice';
import { IWls } from '../store/slice/widgetSlice';
import { memo, useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { ILs } from '../store/slice/logicSlice';
import { LogicWidgetMenu } from './logicWidgetMenu';
import type { SVGProps } from 'react';


export function CarbonLogicalPartition(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 32 32" {...props}><circle cx={9} cy={7} r={1} fill="currentColor"></circle><path fill="currentColor" d="M27 22v-4a2 2 0 0 0-2-2h-8v-4h9a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h9v4H7a2 2 0 0 0-2 2v4H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H7v-4h8v4h-1a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-1v-4h8v4h-1a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2zM8 28H4v-4h4zm10-4v4h-4v-4zM6 10V4h20v6zm22 18h-4v-4h4z"></path></svg>);
}
export function MaterialSymbolsViewInArOutline(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M11 19.475L6 16.6q-.475-.275-.737-.725t-.263-1v-5.75q0-.55.263-1T6 7.4l5-2.875q.475-.275 1-.275t1 .275L18 7.4q.475.275.738.725t.262 1v5.75q0 .55-.262 1T18 16.6l-5 2.875q-.475.275-1 .275t-1-.275m0-2.3v-4.6L7 10.25v4.625zm2 0l4-2.3V10.25l-4 2.325zM2 7V4q0-.825.588-1.412T4 2h3v2H4v3zm5 15H4q-.825 0-1.412-.587T2 20v-3h2v3h3zm10 0v-2h3v-3h2v3q0 .825-.587 1.413T20 22zm3-15V4h-3V2h3q.825 0 1.413.588T22 4v3zm-8 3.85l3.95-2.325L12 6.25L8.05 8.525zm-1 1.725"></path></svg>);
}

export function TablerListDetails(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5h8m-8 4h5m-5 6h8m-8 4h5M3 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"></path></svg>);
}
export function IcRoundSearch(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0c.41-.41.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"></path></svg>);
}

export function MingcuteLayerFill(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" {...props}><g fill="none"><path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="m5.555 5.168l5.554 3.703A2 2 0 0 1 12 10.535V21a1 1 0 0 1-1.555.832L4.891 18.13A2 2 0 0 1 4 16.465V6a1 1 0 0 1 1.555-.832m2.973-2.05a1 1 0 0 1 1.027.05l5.554 3.703A2 2 0 0 1 16 8.535V19a1 1 0 0 1-1.555.832l-.945-.63v-8.667a3.5 3.5 0 0 0-1.559-2.912L8 4.995V4a1 1 0 0 1 .528-.882m5.027-1.95l5.554 3.703A2 2 0 0 1 20 6.535V17a1 1 0 0 1-1.555.832l-.945-.63V8.535a3.5 3.5 0 0 0-1.559-2.912L12 2.995V2a1 1 0 0 1 1.555-.832"></path></g></svg>);
}

const LogicToolHeader = memo(() => {
  const dispatch = useDispatch();
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  return (
    <div className="flex justify-between w-[100%] items-center bg-default-300 p-1">
      <div className="flex justify-between">
        <AInput
          placeholder="搜索组件"
          className="w-[100%] mr-2"
          size="sml"
          radius={'md'}
          startContent={
            // <Icon icon="ic:round-search" width={'20px'} height={'20px'} />
            <IcRoundSearch></IcRoundSearch>
          }
        />
        <Tabs
          size={'sm'}
          aria-label="Tabs sizes"
          defaultSelectedKey={!logicState.contentImageShowType ? 'zI' : 'Co'}
          onSelectionChange={(e) => {
            dispatch(updateContentImageShowType(e === 'zI' ? 0 : 1));
          }}
        >
          <Tab key="zI" title={<ZIndexIcon />} />
          <Tab key="Co" title={<ColIcon></ColIcon>} />
        </Tabs>
      </div>
    </div>
  );
});

const ToolHeader = memo(() => {
  const dispatch = useDispatch();
  const widgetMapState = useSelector((state: { widgetMapSlice: IWs }) => {
    return state.widgetMapSlice;
  });

  return (
    <div className="flex justify-between w-[100%] items-center bg-default-300 p-1">

      <div className="flex justify-between">
        <AInput
          placeholder="搜索组件"
          className="w-[100%] mr-2"
          size="sml"
          radius={'md'}
          startContent={
            // <Icon icon="ic:round-search" width={'20px'} height={'20px'} />
            <IcRoundSearch></IcRoundSearch>
          }
        />
        <Tabs
          size={'sm'}
          aria-label="Tabs sizes"
          defaultSelectedKey={
            !widgetMapState.contentImageShowType ? 'zI' : 'Co'
          }
          onSelectionChange={(e) => {
            dispatch(updateContentImageShowType(e === 'zI' ? 0 : 1));
          }}
        >
          <Tab key="zI" title={<ZIndexIcon />} />
          <Tab key="Co" title={<ColIcon></ColIcon>} />
        </Tabs>
      </div>
    </div>
  );
});

const ColIcon = memo(() => {
  return (
    <svg
      width={16}
      height={16}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path
        d="M204 240H68a36 36 0 0 1-36-36V68a36 36 0 0 1 36-36h136a36 36 0 0 1 36 36v136a36 36 0 0 1-36 36z"
        fill="currentColor"
      ></path>
      <path
        d="M444 240H308a36 36 0 0 1-36-36V68a36 36 0 0 1 36-36h136a36 36 0 0 1 36 36v136a36 36 0 0 1-36 36z"
        fill="currentColor"
      ></path>
      <path
        d="M204 480H68a36 36 0 0 1-36-36V308a36 36 0 0 1 36-36h136a36 36 0 0 1 36 36v136a36 36 0 0 1-36 36z"
        fill="currentColor"
      ></path>
      <path
        d="M444 480H308a36 36 0 0 1-36-36V308a36 36 0 0 1 36-36h136a36 36 0 0 1 36 36v136a36 36 0 0 1-36 36z"
        fill="currentColor"
      ></path>
    </svg>
  );
});
const ZIndexIcon = memo(() => {
  return (
    <svg
      width={16}
      height={16}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path
        d="M368 96H144a16 16 0 0 1 0-32h224a16 16 0 0 1 0 32z"
        fill="currentColor"
      ></path>
      <path
        d="M400 144H112a16 16 0 0 1 0-32h288a16 16 0 0 1 0 32z"
        fill="currentColor"
      ></path>
      <path
        d="M419.13 448H92.87A44.92 44.92 0 0 1 48 403.13V204.87A44.92 44.92 0 0 1 92.87 160h326.26A44.92 44.92 0 0 1 464 204.87v198.26A44.92 44.92 0 0 1 419.13 448z"
        fill="currentColor"
      ></path>
    </svg>
  );
});

export const Tools = memo(() => {
  const WidgetTabs = useMemo(
    () => [
      {
        id: 'view',
        label: (
          <div className="flex items-center">
            {/*<Icon*/}
            {/*  icon="material-symbols:view-in-ar-outline"*/}
            {/*  width={14}*/}
            {/*  height={14}*/}
            {/*  className="mr-1"*/}
            {/*/>*/}
            <MaterialSymbolsViewInArOutline className="mr-1"></MaterialSymbolsViewInArOutline>
            <span>视图组件</span>
          </div>
        ),
        content: (
          <>
            <ToolHeader></ToolHeader>
            <WidgetMenu></WidgetMenu>
          </>
        ),
      },
      {
        id: 'logic',
        label: (
          <div className="flex items-center">
            {/*<Icon*/}
            {/*  icon="carbon:logical-partition"*/}
            {/*  width={14}*/}
            {/*  height={14}*/}
            {/*  className="mr-1"*/}
            {/*/>*/}
            <CarbonLogicalPartition className="mr-1"></CarbonLogicalPartition>
            <span>自动化元件</span>
          </div>
        ),
        content: (
          <>
            <LogicToolHeader></LogicToolHeader>
            <LogicWidgetMenu></LogicWidgetMenu>
          </>
        ),
      },
    ],
    [],
  );
  const dispatch = useDispatch();


  const widgetMapState = useSelector((state: { widgetMapSlice: IWs }) => {
    return state.widgetMapSlice;
  });

  const widgetState = useSelector((state: { widgetSlice: IWls }) => {
    return state.widgetSlice;
  });

  const AttrState = useSelector((state: { attrSlice: IAs }) => {
    return state.attrSlice;
  });

  const onHandleShowAttr = useCallback(() => {
    console.log(AttrState, 'AttrState');
    dispatch(updateAttrShow(!AttrState.show));
  }, [AttrState.show, dispatch]);

  const onHandleShowWidget = useCallback(() => {
    dispatch(updateProviderShow(!widgetMapState.providerShow));
    dispatch(updateWidgetMapShow(!widgetMapState.providerShow));
  }, [dispatch, widgetMapState.providerShow]);

  const gsapToolContainer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!widgetState.show) {
      gsap.to(gsapToolContainer.current, {
        width: '0px',
        minWidth: '0px',
        duration: 0.1,
        ease: 'none',
      });
    } else {
      gsap.to(gsapToolContainer.current, {
        minWidth: '300px',
        width: '300px',
        duration: 0.1,
        ease: 'none',
      });
    }
  }, [widgetState]);

  return (
    <div
      ref={gsapToolContainer}
      className="w-[300px] min-w-[300px] h-full overflow-hidden"
    >
      <div className="w-[300px] min-w-[300px] h-full relative">
        <div className="absolute right-[10px] top-[-2px]">
          <Button
            className="ml-2"
            isIconOnly
            size="sm"
            variant="light"
            aria-label="locale"
            style={{
              background: AttrState.show ? '#338ef7' : '',
            }}
            onClick={onHandleShowAttr}
          >
            {/*<Icon icon="tabler:list-details" width={'16px'} height={'16px'} />*/}
            <TablerListDetails></TablerListDetails>
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            aria-label="locale"
            className="m-1"
            style={{
              background: widgetMapState.providerShow ? '#338ef7' : '',
            }}
            onClick={onHandleShowWidget}
          >
            {/*<Icon icon="mingcute:layer-fill" width={'16px'} height={'16px'} />*/}
            <MingcuteLayerFill></MingcuteLayerFill>
          </Button>
        </div>
        <div className="h-[calc(100%_-_40px)]">
          {useMemo(
            () => (
              <Tabs
                aria-label="lv tabs"
                items={WidgetTabs}
                radius="md"
                size={'sm'}
                classNames={{
                  tab: '',
                  tabList: 'mb-1 w-[212px]',
                  panel: 'p-0 h-[100%] w-[100%]',
                  cursor: '',
                  base: 'w-[100%] bg-zinc500',
                }}
              >
                {(item: {
                  id: string;
                  label: React.ReactNode | string;
                  content: React.ReactNode | string;
                }) => (
                  <Tab key={item.id} title={item.label}>
                    <Card className="rounded-md h-[100%]">
                      <CardBody className="p-0">{item.content}</CardBody>
                    </Card>
                  </Tab>
                )}
              </Tabs>
            ),
            [WidgetTabs],
          )}
        </div>
      </div>
    </div>
  );
});
