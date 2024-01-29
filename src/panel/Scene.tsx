import { ARuler } from "./ruler";
import { useHotkeys } from "react-hotkeys-hook";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Button,
  Tooltip,
  Kbd,
  AutocompleteItem,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  Autocomplete,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  useDisclosure,
} from "@nextui-org/react";

import gsap from "gsap";
import { Icon } from "@iconify-icon/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { IWs, updateShow } from "../store/slice/widgetMapSlice";
import { AR_PANEL_DOM_ID } from "../contant";
import { IPs } from "../store/slice/panelSlice";

const View = () => {
  return (
    <div id={AR_PANEL_DOM_ID} className="w-full h-full">
      <ARuler></ARuler>
    </div>
  );
};

export const STabs = [
  {
    id: "view",
    label: "视图",
    content: <View></View>,
  },
  {
    id: "logic",
    label: "逻辑",
    content: <>123</>,
  },
];

const HotKeyModal = ({ open }: { open: boolean }) => {
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
                      <Kbd keys={[]}>KeyF</Kbd>
                    </TableCell>
                    <TableCell>
                      <Kbd keys={[]}>KeyF</Kbd>
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
};

const SceneLayer = () => {
  const [hotKeyOpen, setHotKeyOpen] = useState(false);

  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    console.log(state, "statescvsfv");
    return state.panelSlice;
  });

  return (
    <>
      <div className="w-full h-full bg-content1 overflow-hidden flex flex-col-reverse relative">
        <div className="absolute bottom-[5px] left-[5px]">
          <Chip
            startContent={
              <Icon icon="material-symbols:history" height={16} width={16} />
            }
            variant="faded"
            radius="sm"
            color="default"
          >
            <small>操作历史</small>
          </Chip>
        </div>
        <div className="absolute bottom-[5px] right-[5px]">
          <Tooltip
            color={"default"}
            content={"快捷键"}
            placement="top"
            className="capitalize"
          >
            <Icon
              icon="material-symbols:keyboard"
              className="cursor-pointer mr-2"
              height={16}
              width={16}
              onClick={() => {
                setHotKeyOpen(!hotKeyOpen);
              }}
            />
          </Tooltip>
          <Tooltip
            color={"default"}
            content={"锁定画布状态"}
            placement="top"
            className="capitalize"
          >
            <Icon
              icon="uis:lock"
              className="cursor-pointer mr-2"
              height={16}
              width={16}
            />
          </Tooltip>
          <Tooltip
            color={"default"}
            content={"当前缩放值"}
            placement="top"
            className="capitalize"
          >
            <Chip
              startContent={
                <Icon
                  icon="carbon:intent-request-scale-in"
                  className="cursor-pointer mx-1"
                  height={16}
                  width={16}
                />
              }
              variant="faded"
              color="success"
            >
              {PanelState.tickUnit}
            </Chip>
          </Tooltip>
        </div>
        <Tabs
          aria-label="Dynamic tabs"
          size="sm"
          items={STabs}
          radius="md"
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
                <CardBody className="p-0">{item.content}</CardBody>
              </Card>
            </Tab>
          )}
        </Tabs>
      </div>
      <HotKeyModal open={hotKeyOpen}></HotKeyModal>
    </>
  );
};

const widgetMapTabs = [
  {
    id: "col",
    label: "缩略",
  },
  {
    id: "list",
    label: "列表",
  },
];

const SceneWidgetMap = () => {
  const gsapSceneWidgetContainer = useRef<HTMLDivElement>(null);

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
        maxWidth: "240px",
        minWidth: "240px",
        width: "240px",
        padding: "0rem 0.5rem",
        duration: 0.1,
        ease: "none",
      });
    }
  }, [widgetMapState]);

  return (
    <div
      ref={gsapSceneWidgetContainer}
      className="w-[240px] px-2 overflow-hidden"
    >
      <div ref={gsapSceneWidgetContainer} className="w-[240px] px-2">
        <div className="flex w-full justify-between items-center py-2">
          <small className="">组件映射</small>
          <Tabs size="sm" aria-label="Dynamic tabs" items={widgetMapTabs}>
            {(item) => <Tab key={item.id} title={item.label}></Tab>}
          </Tabs>
        </div>
        <Divider className="my-1" />
      </div>
    </div>
  );
};

const AContent = () => {
  return (
    <div className="w-full h-full flex">
      <SceneWidgetMap></SceneWidgetMap>
      <SceneLayer></SceneLayer>
    </div>
  );
};

const SLayerTabs = [
  {
    id: "layer1",
    label: "图层1",
    content: <AContent></AContent>,
  },
  {
    id: "layer-Create",
    label: "图层2",
    content: <SceneLayer></SceneLayer>,
  },
];
export const Scene = () => {
  const gsapSceneContainer = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const widgetMapState = useSelector((state: { widgetMapSlice: IWs }) => {
    return state.widgetMapSlice;
  });

  const onHandleOpenWidMap = useCallback(() => {
    dispatch(updateShow(!widgetMapState.show));
  }, [widgetMapState]);

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

  return (
    <div className="w-full h-full flex relative">
      <div className="absolute left-[14px]">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          aria-label="locale"
          className="m-1"
          onClick={onHandleOpenWidMap}
        >
          <Icon
            icon={
              widgetMapState.show
                ? "mdi:arrow-collapse-left"
                : "mdi:arrow-collapse-right"
            }
          />
        </Button>
      </div>

      <div className="absolute left-[14px] top-[40px]">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          aria-label="locale"
          className="m-1"
        >
          <Icon icon="gridicons:create" />
        </Button>
      </div>
      <Tabs
        aria-label="Dynamic tabs"
        size="sm"
        items={SLayerTabs}
        color="primary"
        radius="md"
        classNames={{
          tab: "",
          tabList: "map-a-left-vis-tab flex flex-col mt-[80px]",
          panel: "p-0 bg-default-100 h-[calc(100%)] w-[100%]",
          cursor: "rounded-md",
          base: "map-a-left-vis bg-default-50 p-1 flex justify-center",
        }}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            <Card className="rounded-none h-[100%]">
              <CardBody className="p-0">{item.content}</CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
};