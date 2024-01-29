import { Icon } from "@iconify-icon/react";
import { Tabs, Tab, Card, CardBody, Button } from "@nextui-org/react";
import { AInput } from "../comp/AInput";
import gsap from "gsap";
import { WidgetMenu } from "./widgetMenu";
import { useSelector, useDispatch } from "react-redux";
import { IAs, updateShow } from "../store/slice/atterSlice";
import { IWs, updateProviderShow } from "../store/slice/widgetMapSlice";
import { IWls } from "../store/slice/widgetSlice";
import { useLayoutEffect, useRef } from "react";

const ToolHeader = () => {
  return (
    <div className="flex justify-between w-[100%] items-center bg-default-300 p-1">
      {/* <div className="flex items-center p-2">
        <Icon icon="mdi:widget-tree" width={"16px"} height={"16px"} />
      </div> */}
      <div className="flex justify-between">
        <AInput
          placeholder="搜索组件"
          className="w-[100%] mr-2"
          size="sml"
          radius={"md"}
          startContent={
            <Icon icon="ic:round-search" width={"20px"} height={"20px"} />
          }
        />
        <Tabs size={"sm"} aria-label="Tabs sizes">
          <Tab key="photos" title={<ZIndexIcon />} />
          <Tab key="music" title={<ColIcon></ColIcon>} />
        </Tabs>
      </div>
    </div>
  );
};

const WidgetTabs = [
  {
    id: "view",
    label: (
      <div className="flex items-center">
        <Icon
          icon="material-symbols:view-in-ar-outline"
          width={14}
          height={14}
          className="mr-1"
        />
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
    id: "logic",
    label: (
      <div className="flex items-center">
        <Icon
          icon="carbon:logical-partition"
          width={14}
          height={14}
          className="mr-1"
        />
        <span>逻辑元件</span>
      </div>
    ),
    content: <>12</>,
  },
];

const ColIcon = () => {
  return (
    <svg
      width={16}
      height={16}
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
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
};
const ZIndexIcon = () => {
  return (
    <svg
      width={16}
      height={16}
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
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
};

export const Tools = () => {
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

  const onHandleShowAttr = () => {
    dispatch(updateShow(!AttrState.show));
  };

  const onHandleShowWidget = () => {
    dispatch(updateProviderShow(!widgetMapState.providerShow));
  };

  const gsapToolContainer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!widgetState.show) {
      gsap.to(gsapToolContainer.current, {
        width: "0px",
        minWidth: "0px",
        duration: 0.1,
        ease: "none",
      });
    } else {
      gsap.to(gsapToolContainer.current, {
        minWidth: "300px",
        width: "300px",
        duration: 0.1,
        ease: "none",
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
              background: AttrState.show ? "#338ef7" : "",
            }}
            onClick={onHandleShowAttr}
          >
            <Icon icon="tabler:list-details" width={"16px"} height={"16px"} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            aria-label="locale"
            className="m-1"
            style={{
              background: widgetMapState.providerShow ? "#338ef7" : "",
            }}
            onClick={onHandleShowWidget}
          >
            <Icon icon="mingcute:layer-fill" width={"16px"} height={"16px"} />
          </Button>
          {/* <Button
          className="ml-2"
          isIconOnly
          size="sm"
          variant="light"
          aria-label="locale"
          onClick={onHandleWidVis}
        >
          <Icon icon="mdi:arrow-collapse-left" width={"16px"} height={"16px"} />
        </Button> */}
        </div>
        <div className="h-[calc(100%_-_40px)]">
          <Tabs
            aria-label="lv tabs"
            items={WidgetTabs}
            radius="md"
            size={"sm"}
            classNames={{
              tab: "",
              tabList: "mb-1 w-[192px]",
              panel: "p-0 h-[100%] w-[100%]",
              cursor: "",
              base: "w-[100%] bg-zinc500",
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
        </div>
      </div>
    </div>
  );
};
