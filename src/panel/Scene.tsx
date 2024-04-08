import { ARuler } from "./ruler";

import {
  Tabs,
  Tab,
  Card,
  CardFooter,
  CardBody,
  Button,
  Tooltip,
  Kbd,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  useDisclosure,
} from "@nextui-org/react";

import gsap from "gsap";
// import { Icon } from '@iconify-icon/react';
import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { IWs, updateWidgetMapShow } from "../store/slice/widgetMapSlice";
import { AR_PANEL_DOM_ID, MAIN_CONTAINER, MAIN_LAYER } from "../contant";
import { IPs, updateCurrentSTab } from "../store/slice/panelSlice";
import {
  INs,
  IViewNode,
  addNode,
  deleteListItem,
} from "../store/slice/nodeSlice";
import { NodeSlot } from "./operation";
import { LogicPanel } from "./logicPanel.tsx";
import type { SVGProps } from "react";
import { ILs } from "../store/slice/logicSlice.ts";
import { useAutoHeight } from "../comp/useAutoHeight.tsx";
import { addLayer, subscribeLayerCreate } from "./layers.ts";
import { v4 } from "uuid";
import { ReactKey } from "@react-awesome-query-builder/mui";
import { updateCurrentLayer } from "../store/slice/widgetSlice.ts";
import { useFilterLogicNode, useFilterViewNode } from "./useFilter.tsx";

export function SolarLockBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16"
        opacity={0.5}
      ></path>
      <path
        fill="currentColor"
        d="M6.75 8a5.25 5.25 0 0 1 10.5 0v2.004c.567.005 1.064.018 1.5.05V8a6.75 6.75 0 0 0-13.5 0v2.055a23.57 23.57 0 0 1 1.5-.051z"
      ></path>
    </svg>
  );
}

export function MaterialSymbolsLightDeleteOutline(
  props: SVGProps<SVGSVGElement>
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M7.615 20q-.67 0-1.143-.472Q6 19.056 6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.152T16.385 20zM17 6H7v12.385q0 .269.173.442t.442.173h8.77q.23 0 .423-.192t.192-.423zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z"
      ></path>
    </svg>
  );
}

export function MaterialSymbolsCreateNewFolderOutline(
  props: SVGProps<SVGSVGElement>
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M14 16h2v-2h2v-2h-2v-2h-2v2h-2v2h2zM4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20zm0-2h16V8h-8.825l-2-2H4zm0 0V6z"
      ></path>
    </svg>
  );
}

export function MdiArrowCollapseRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12.08 4.08L20 12l-7.92 7.92l-1.41-1.42l5.5-5.5H2v-2h14.17l-5.5-5.5zM20 12v10h2V2h-2z"
      ></path>
    </svg>
  );
}

export function MdiArrowCollapseLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M11.92 19.92L4 12l7.92-7.92l1.41 1.42l-5.5 5.5H22v2H7.83l5.51 5.5zM4 12V2H2v20h2z"
      ></path>
    </svg>
  );
}

export function PajamasRemove(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13px"
      height="13px"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5.75 3V1.5h4.5V3zm-1.5 0V1a1 1 0 0 1 1-1h5.5a1 1 0 0 1 1 1v2h2.5a.75.75 0 0 1 0 1.5h-.365l-.743 9.653A2 2 0 0 1 11.148 16H4.852a2 2 0 0 1-1.994-1.847L2.115 4.5H1.75a.75.75 0 0 1 0-1.5zm-.63 1.5h8.76l-.734 9.538a.5.5 0 0 1-.498.462H4.852a.5.5 0 0 1-.498-.462z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export function MingcuteCopyFill(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13px"
      height="13px"
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none">
        <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
        <path
          fill="currentColor"
          d="M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2zm-9 13H8a1 1 0 0 0-.117 1.993L8 17h2a1 1 0 0 0 .117-1.993zm9-11H9v2h6a2 2 0 0 1 2 2v8h2zm-7 7H8a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2"
        ></path>
      </g>
    </svg>
  );
}

export function CarbonIntentRequestScaleIn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        fill="currentColor"
        d="m28.6 30l1.4-1.4l-7.6-7.6H29v-2H19v10h2v-6.6zM2 28.6L3.4 30l7.6-7.6V29h2V19H3v2h6.6zM17 2h-2v10.2l-4.6-4.6L9 9l7 7l7-7l-1.4-1.4l-4.6 4.6z"
      ></path>
    </svg>
  );
}

export function FeUnlock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7 10V7a5 5 0 1 1 10 0c0 .55-.45 1-1 1s-1-.45-1-1a3 3 0 0 0-6 0v3h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2zm-1 2v8h12v-8zm8 2h2v4h-2z"
      ></path>
    </svg>
  );
}

export function IcRoundLock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2m-6 9c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2M9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2z"
      ></path>
    </svg>
  );
}

export function IcBaselineKeyboard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m-9 3h2v2h-2zm0 3h2v2h-2zM8 8h2v2H8zm0 3h2v2H8zm-1 2H5v-2h2zm0-3H5V8h2zm9 7H8v-2h8zm0-4h-2v-2h2zm0-3h-2V8h2zm3 3h-2v-2h2zm0-3h-2V8h2z"
      ></path>
    </svg>
  );
}

export function MdiHistory(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M13.5 8H12v5l4.28 2.54l.72-1.21l-3.5-2.08zM13 3a9 9 0 0 0-9 9H1l3.96 4.03L9 12H6a7 7 0 0 1 7-7a7 7 0 0 1 7 7a7 7 0 0 1-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.896 8.896 0 0 0 13 21a9 9 0 0 0 9-9a9 9 0 0 0-9-9"
      ></path>
    </svg>
  );
}

const View = memo(() => {
  return (
    <div id={AR_PANEL_DOM_ID} className="w-full h-full">
      <ARuler></ARuler>
    </div>
  );
});

export const STabs = [
  {
    id: "view",
    label: "视图",
    content: <View></View>,
  },
  {
    id: "logic",
    label: "逻辑",
    content: <LogicPanel></LogicPanel>,
  },
];

const HotKeyModal = memo(({ open }: { open: boolean }) => {
  useEffect(() => {
    open ? onOpen() : onClose();
  }, [open]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Modal
      size={"2xl"}
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">快捷键</ModalHeader>
            <ModalBody>
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn>作用</TableColumn>
                  <TableColumn>win快捷键</TableColumn>
                  <TableColumn>mac快捷键</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key="1">
                    <TableCell>放大缩小</TableCell>
                    <TableCell>
                      <Kbd keys={[]}>KeyF+Wheel</Kbd>
                    </TableCell>
                    <TableCell>
                      <Kbd keys={[]}>KeyF+Wheel</Kbd>
                    </TableCell>
                  </TableRow>
                  <TableRow key="2">
                    <TableCell>锁定面板</TableCell>
                    <TableCell>
                      <Kbd keys={[]}>KeyS</Kbd>
                    </TableCell>
                    <TableCell>
                      <Kbd keys={[]}>KeyS</Kbd>
                    </TableCell>
                  </TableRow>
                  <TableRow key="3">
                    <TableCell>多选</TableCell>
                    <TableCell>
                      <Kbd keys={["shift"]}>KeyW</Kbd>
                    </TableCell>
                    <TableCell>
                      <Kbd keys={["shift"]}>KeyW</Kbd>
                    </TableCell>
                  </TableRow>
                  <TableRow key="4">
                    <TableCell>锚定节点</TableCell>
                    <TableCell>
                      <Kbd keys={["shift"]}>KeyV</Kbd>
                    </TableCell>
                    <TableCell>
                      <Kbd keys={["shift"]}>KeyV</Kbd>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                关闭
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

const SceneLayer = memo(() => {
  const [hotKeyOpen, setHotKeyOpen] = useState(false);
  const dispatch = useDispatch();
  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });

  const onHandleUpdateSTab = useCallback((key: string) => {
    dispatch(updateCurrentSTab(key));
  }, []);
  return (
    <>
      <div className="w-full h-full bg-content1 overflow-hidden flex flex-col-reverse relative">
        <div className="absolute bottom-[5px] left-[5px]">
          <Chip
            startContent={<MdiHistory></MdiHistory>}
            variant="faded"
            radius="sm"
            color="default"
          >
            <small>操作历史</small>
          </Chip>
        </div>
        <div className="absolute bottom-[5px] right-[5px] flex items-center">
          <Tooltip
            color={"default"}
            content={"快捷键"}
            placement="top"
            className="capitalize"
          >
            <div>
              <IcBaselineKeyboard
                className="cursor-pointer mr-2"
                onClick={() => setHotKeyOpen(!hotKeyOpen)}
              ></IcBaselineKeyboard>
            </div>
          </Tooltip>
          <Tooltip
            color={PanelState.lockTransform ? "danger" : "success"}
            content={
              PanelState.lockTransform ? "已锁定transform" : "未锁定transform"
            }
            placement="top"
            className="capitalize"
          >
            <div>
              <>
                {PanelState.lockTransform ? (
                  <IcRoundLock className="cursor-pointer mr-2"></IcRoundLock>
                ) : (
                  <FeUnlock className="cursor-pointer mr-2"></FeUnlock>
                )}
              </>
            </div>
          </Tooltip>
          <Tooltip
            color={PanelState.lockScale ? "danger" : "success"}
            content={PanelState.lockScale ? "缩放已锁定" : "缩放已解锁"}
            placement="top"
            className="capitalize"
          >
            <Chip
              startContent={
                <CarbonIntentRequestScaleIn className="cursor-pointer mx-1" />
              }
              variant="faded"
              color={PanelState.lockScale ? "danger" : "success"}
            >
              {PanelState.tickUnit}
            </Chip>
          </Tooltip>
        </div>
        <Tabs
          aria-label="Dynamic tabs"
          size="sm"
          items={STabs}
          selectedKey={PanelState.currentSTab}
          radius="md"
          onSelectionChange={(key) => {
            onHandleUpdateSTab(key as string);
          }}
          classNames={{
            tab: "",
            tabList: "w-[120px]",
            panel: "p-0 bg-default-100 h-[calc(100%)] w-[100%]",
            cursor: "rounded-md",
            base: "bg-default-200 p-1 flex justify-center",
          }}
        >
          {(item) => (
            <Tab key={item.id} title={item.label}>
              <Card className="rounded-none h-[100%]">
                <CardBody className="p-0 overflow-hidden">
                  {item.content}
                </CardBody>
              </Card>
            </Tab>
          )}
        </Tabs>
      </div>
      <HotKeyModal open={hotKeyOpen}></HotKeyModal>
    </>
  );
});

const widgetMapTabs = [
  {
    id: "logic_map_list",
    label: "逻辑",
  },
  {
    id: "view_map_list",
    label: "视图",
  },
];

const SceneWidgetMap = memo(() => {
  const layerViewNode = useFilterViewNode();
  const layerLogicNode = useFilterLogicNode();
  const dispatch = useDispatch();
  const [currentType, setCurrentType] = useState<
    "logic_map_list" | "view_map_list"
  >("view_map_list");
  const gsapSceneWidgetContainer = useRef<HTMLDivElement>(null);
  const height = useAutoHeight();
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  const widgetMapState = useSelector((state: { widgetMapSlice: IWs }) => {
    return state.widgetMapSlice;
  });

  useLayoutEffect(() => {
    if (!widgetMapState.show) {
      gsap.to(gsapSceneWidgetContainer.current, {
        width: "0px",
        maxWidth: "0px",
        minWidth: "0px",
        duration: 0.1,
        padding: "0rem",
        ease: "none",
      });
    } else {
      gsap.to(gsapSceneWidgetContainer.current, {
        maxWidth: "210px",
        minWidth: "210px",
        width: "210px",

        duration: 0.1,
        ease: "none",
      });
    }
  }, [widgetMapState]);

  const onHandleRemove = useCallback(
    (id: string) => {
      dispatch(deleteListItem({ idList: [id] }));
    },
    [dispatch]
  );

  const onHandleCopy = useCallback(
    (id: string) => {
      const clone = NodesState.list[id];
      if (clone) {
        dispatch(
          addNode({ ...clone, copyBy: clone.id, id: clone.id + "-clone" })
        );
      }
    },
    [NodesState.list, dispatch]
  );

  return (
    <div
      ref={gsapSceneWidgetContainer}
      className="w-[210px] px-2 overflow-hidden"
    >
      <div ref={gsapSceneWidgetContainer} className="w-[210px] px-2">
        <div className="flex w-full justify-between items-center py-2">
          <small className="">组件映射</small>
          <Tabs
            size="sm"
            aria-label="comMap"
            items={widgetMapTabs}
            classNames={{
              tabList: "",
            }}
            onSelectionChange={(key) => {
              setCurrentType(key as "logic_map_list" | "view_map_list");
            }}
          >
            {(item) => <Tab key={item.id} title={item.label}></Tab>}
          </Tabs>
        </div>
        <Divider className="my-1" />
        <div
          className="w-full overflow-y-scroll px-1"
          style={{
            height: height - 100 + "px",
          }}
        >
          {currentType === "logic_map_list" ? (
            <>
              {layerLogicNode.map((node) => {
                return (
                  <Fragment key={node.id}>
                    <Card
                      shadow="sm"
                      key={node.id}
                      isPressable
                      className="w-full my-1"
                      style={{
                        border: logicState.target.includes(node.id)
                          ? "1px solid #006FEE"
                          : "",
                      }}
                      onPress={() => {}}
                    >
                      <CardBody className="overflow-visible p-1">
                        <img
                          src={node.imageUrl}
                          alt=""
                          className={"w-full h-[55px]"}
                        />
                      </CardBody>
                      <CardFooter className="text-small justify-center items-center">
                        <small>{node.belongClass}</small>
                      </CardFooter>
                    </Card>
                  </Fragment>
                );
              })}
            </>
          ) : (
            <>
              {layerViewNode.map((node: IViewNode) => {
                return (
                  <Card
                    shadow="sm"
                    key={node.id}
                    isPressable
                    className="w-full my-1"
                    style={{
                      border: NodesState.targets.includes(node.id)
                        ? "1px solid #006FEE"
                        : "",
                    }}
                    onPress={() => {}}
                  >
                    <CardBody className="overflow-visible p-0">
                      <NodeSlot tag="cube" node={node} isTemp={true}></NodeSlot>
                    </CardBody>
                    <CardFooter className="text-small justify-between items-center">
                      <small className="text-default-500">{node.alias}</small>
                      <p className={"flex"}>
                        <Tooltip
                          color={"default"}
                          content={"复制"}
                          placement="top"
                          className="capitalize"
                        >
                          <div>
                            <MingcuteCopyFill
                              className="text-default-500 mr-2"
                              onClick={() => onHandleCopy(node.id)}
                            ></MingcuteCopyFill>
                          </div>
                        </Tooltip>
                        <Tooltip
                          color={"default"}
                          content={"删除"}
                          placement="top"
                          className="capitalize"
                        >
                          <div>
                            <PajamasRemove
                              className="text-default-500"
                              onClick={() => onHandleRemove(node.id)}
                            ></PajamasRemove>
                          </div>
                        </Tooltip>
                      </p>
                    </CardFooter>
                  </Card>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

const AContent = memo(() => {
  return (
    <div className="w-full h-full flex">
      <SceneWidgetMap></SceneWidgetMap>
      <SceneLayer></SceneLayer>
    </div>
  );
});

export const Scene = memo(() => {
  const dispatch = useDispatch();

  const widgetMapState = useSelector((state: { widgetMapSlice: IWs }) => {
    return state.widgetMapSlice;
  });

  const onHandleOpenWidMap = useCallback(() => {
    dispatch(updateWidgetMapShow(!widgetMapState.show));
  }, [dispatch, widgetMapState]);

  useLayoutEffect(() => {
    const dom = document.querySelector(".map-a-left-vis");
    const tab = document.querySelector(".map-a-left-vis-tab");

    if (!widgetMapState.providerShow) {
      if (!dom || !tab) {
        return;
      }
      gsap.to(tab, {
        visibility: "hidden",
        duration: 0.1,
        ease: "none",
      });
      gsap.to(dom, {
        width: "0px",
        padding: "0rem",
        duration: 0.1,
        ease: "none",
      });
    } else {
      gsap.to(tab, {
        visibility: "visible",
        duration: 0.1,
        ease: "none",
      });
      gsap.to(dom, {
        width: "72px",
        padding: "0.25rem",
        duration: 0.1,
        ease: "none",
      });
    }
  }, [widgetMapState]);

  const onCreateNewLayer = useCallback(() => {
    const layerId = v4();
    const viewLayerId = v4();
    const logicLayerId = v4();
    addLayer(layerId, logicLayerId, viewLayerId);
  }, []);

  return (
    <div
      id={MAIN_CONTAINER}
      className="w-full h-full flex relative overflow-hidden"
    >
      <div className="absolute left-[14px]">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          aria-label="locale"
          className="m-1"
          onClick={onHandleOpenWidMap}
        >
          {widgetMapState.show ? (
            <MdiArrowCollapseLeft></MdiArrowCollapseLeft>
          ) : (
            <MdiArrowCollapseRight></MdiArrowCollapseRight>
          )}
        </Button>
      </div>

      <div className="absolute left-[14px] top-[40px]">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          aria-label="locale"
          className="m-1"
          onClick={onCreateNewLayer}
        >
          {/*<Icon icon="gridicons:create" />*/}
          <MaterialSymbolsCreateNewFolderOutline></MaterialSymbolsCreateNewFolderOutline>
        </Button>
      </div>
      <LayerContent></LayerContent>
    </div>
  );
});

const LayerContent = memo(() => {
  const dispatch = useDispatch();

  const [sLayerTabs, setSLayerTabs] = useState<
    {
      id: string;
      label: string;
    }[]
  >([
    {
      id: MAIN_LAYER,
      label: "主图层",
    },
  ]);

  useEffect(() => {
    const sub = subscribeLayerCreate((params) => {
      setSLayerTabs((cur) => {
        return cur.concat([
          {
            id: params.layerName,
            label: "副图层",
          },
        ]);
      });
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);

  const onHandleSelectLayer = useCallback(
    (key: ReactKey) => {
      dispatch(updateCurrentLayer(key));
    },
    [dispatch]
  );

  return (
    <>
      <Tabs
        aria-label="Dynamic tabs"
        size="sm"
        items={sLayerTabs}
        color="primary"
        radius="md"
        classNames={{
          tab: "",
          tabList: "map-a-left-vis-tab flex flex-col mt-[80px]",
          panel: "p-0 bg-default-100 h-[calc(100%)] w-[100%]",
          cursor: "rounded-md",
          base: "map-a-left-vis bg-default-50 p-1 flex justify-center",
        }}
        onSelectionChange={(key) => onHandleSelectLayer(key)}
      >
        {(item) => (
          <Tab
            key={item.id}
            title={
              <div className="flex items-center justify-between">
                <small className="pr-1">{item.label}</small>
                {item.label === "主图层" ? (
                  <SolarLockBoldDuotone></SolarLockBoldDuotone>
                ) : (
                  <MaterialSymbolsLightDeleteOutline
                    onClick={() => {
                      setSLayerTabs((cur) => {
                        return cur.filter((c) => c.id !== item.id);
                      });
                    }}
                  ></MaterialSymbolsLightDeleteOutline>
                )}
              </div>
            }
          ></Tab>
        )}
      </Tabs>
      <Card className="rounded-none h-[100%] w-full">
        <CardBody className="p-0">
          <AContent></AContent>
        </CardBody>
      </Card>
    </>
  );
});
