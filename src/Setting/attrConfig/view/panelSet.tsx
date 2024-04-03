import { memo, useCallback } from "react";
import { AInput } from "../../../comp/AInput.tsx";
import {
  Button,
  Card,
  CardBody,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
  Tab,
  Tabs,
  Tooltip,
} from "@nextui-org/react";
import { ColorResult, SketchPicker } from "react-color";
import type { SVGProps } from "react";
import {
  IPs,
  updatePanelColor,
  updatePanelHeight,
  updatePanelLeft,
  updatePanelLockScale,
  updatePanelLockTransform,
  updatePanelTop,
  updatePanelWidth,
} from "../../../store/slice/panelSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_PANEL_COLOR } from "../../../contant";
import { toast } from "react-toastify";

export function IconParkOutlineUploadWeb(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="130px"
      height="130px"
      viewBox="0 0 48 48"
      {...props}
    >
      <g fill="none">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={4}
          d="M28 40H7a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3h34a3 3 0 0 1 3 3v12.059M39 41V29m-5 5l5-5l5 5"
        ></path>
        <path
          stroke="currentColor"
          strokeWidth={4}
          d="M4 11a3 3 0 0 1 3-3h34a3 3 0 0 1 3 3v9H4z"
        ></path>
        <circle
          r={2}
          fill="currentColor"
          transform="matrix(0 -1 -1 0 10 14)"
        ></circle>
        <circle
          r={2}
          fill="currentColor"
          transform="matrix(0 -1 -1 0 16 14)"
        ></circle>
      </g>
    </svg>
  );
}

const ColorPick = memo(() => {
  const dispatch = useDispatch();
  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });
  const onHandleColorChange = useCallback((color: ColorResult) => {
  
    dispatch(updatePanelColor(color.hex));
  }, []);

  return (
    <Popover placement="bottom" showArrow offset={10}>
      <PopoverTrigger>
        <div className="flex items-center">
          <small className="w-[30px]">颜色</small>
          <AInput
            placeholder="颜色"
            className="w-[100%] rounded-md"
            size="xs"
            radius="md"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[230px]">
        <div className="px-1 py-2 w-full">
          <SketchPicker
            color={PanelState.panelColor}
            onChange={onHandleColorChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
});
export const ProviderSetting = memo(() => {
  const dispatch = useDispatch();
  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });
  const onHandleResetColor = useCallback(() => {
    dispatch(updatePanelColor(DEFAULT_PANEL_COLOR));
  }, [dispatch]);

  const onHandleUpdatePanelLeft = useCallback((x: string) => {
    if (x !== "0") {
      Number(x)
        ? dispatch(updatePanelLeft(Number(x)))
        : toast.error("x点输入不合法");
    } else {
      dispatch(updatePanelLeft(0));
    }
  }, []);

  const onHandleUpdatePanelTop = useCallback((y: string) => {
    if (y !== "0") {
      Number(y)
        ? dispatch(updatePanelTop(Number(y)))
        : toast.error("y点输入不合法");
    } else {
      dispatch(updatePanelLeft(0));
    }
  }, []);

  const onHandleUpdatePanelWidth = useCallback((w: string) => {
    Number(w) && dispatch(updatePanelWidth(Number(w)));
  }, []);

  const onHandleUpdatePanelHeight = useCallback((h: string) => {
    Number(h) && dispatch(updatePanelHeight(Number(h)));
  }, []);

  return (
    <div>
      <div className="flex">
        <div className="flex items-center">
          <small className="w-[30px]">长</small>
          <AInput
            placeholder="长"
            className="w-[80px] mr-2 rounded-md"
            size="xs"
            radius="md"
            value={String(PanelState.panelWidth)}
            onChange={(e) => {
              onHandleUpdatePanelWidth(e.target.value);
            }}
          />
        </div>
        <div className="flex items-center">
          <small className="w-[30px]">宽</small>
          <AInput
            placeholder="宽"
            className="w-[80px] rounded-md"
            size="xs"
            radius="md"
            value={String(PanelState.panelHeight)}
            onChange={(e) => {
              onHandleUpdatePanelHeight(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex mt-2">
        <div className="flex items-center">
          <small className="w-[30px]">x</small>
          <AInput
            placeholder="x"
            className="w-[80px] mr-2 rounded-md"
            size="xs"
            radius="md"
            value={String(PanelState.panelLeft)}
            onChange={(e) => {
              onHandleUpdatePanelLeft(e.target.value);
            }}
          />
        </div>
        <div className="flex items-center">
          <small className="w-[30px]">y</small>
          <AInput
            placeholder="y"
            className="w-[80px] rounded-md"
            size="xs"
            radius="md"
            value={String(PanelState.panelTop)}
            onChange={(e) => {
              onHandleUpdatePanelTop(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex justify-center py-3">
        <div className="flex flex-col items-center">
          <IconParkOutlineUploadWeb></IconParkOutlineUploadWeb>
          <small className="text-zinc-500 text-center">
            容器背景,上传大小最大500kb,格式PNG/JPG
          </small>
        </div>
      </div>
      <div>
        <ColorPick></ColorPick>
      </div>
      <div className="flex mt-2 items-center">
        <small className="w-[80px]">背景控制</small>
        <div className="flex">
          <Button size="sm" className="mr-2">
            清除背景图片
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onHandleResetColor();
            }}
          >
            清除背景颜色
          </Button>
        </div>
      </div>
      {/*<div className="flex mt-2 items-center">*/}
      {/*  <small className="w-[80px]">边界控制</small>*/}
      {/*  <div className="flex">*/}
      {/*    <Tabs*/}
      {/*      size={'sm'}*/}
      {/*      aria-label="Tabs sizes"*/}
      {/*      defaultSelectedKey={'bound'}*/}
      {/*    >*/}
      {/*      <Tab key="bound" title="控制覆盖" />*/}
      {/*      <Tab key="over" title="溢出隐藏" />*/}
      {/*    </Tabs>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
});

export function PhQuestion(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M140 180a12 12 0 1 1-12-12a12 12 0 0 1 12 12M128 72c-22.06 0-40 16.15-40 36v4a8 8 0 0 0 16 0v-4c0-11 10.77-20 24-20s24 9 24 20s-10.77 20-24 20a8 8 0 0 0-8 8v8a8 8 0 0 0 16 0v-.72c18.24-3.35 32-17.9 32-35.28c0-19.85-17.94-36-40-36m104 56A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88"
      ></path>
    </svg>
  );
}

const PanelSetting = memo(() => {
  const dispatch = useDispatch();
  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });

  return (
    <div>
      <div className="flex items-center">
        <span>锁定画布位移:</span>
        <Switch
          size="sm"
          className="ml-2"
          aria-label="PanelSetting"
          checked={PanelState.lockTransform}
          onChange={(e) => {
            dispatch(updatePanelLockTransform(e.target.checked));
          }}
        />
      </div>
      <div className="flex items-center  mt-2">
        <span>锁定画布缩放:</span>
        <Switch
          size="sm"
          className="ml-2"
          aria-label="Automatic updates"
          checked={PanelState.lockScale}
          onChange={(e) => {
            dispatch(updatePanelLockScale(e.target.checked));
          }}
        />
      </div>

      <div className="flex items-center mt-2">
        <span>刻度颗粒度:</span>
        <AInput
          placeholder="刻度颗粒度"
          className="w-[130px] ml-2 rounded-md"
          size="xs"
          radius="md"
        />
      </div>
      <div className="flex items-center mt-2">
        <span>单位鼠标滚动缩放颗粒度:</span>
        <AInput
          placeholder="刻度颗粒度"
          className="w-[130px] ml-2 rounded-md"
          size="xs"
          radius="md"
        />
      </div>
      <div className="flex items-center mt-2">
        <span className="flex items-center">
          聚焦设置
          <Tooltip
            color={"default"}
            content={"将视角聚焦至某点,并将其放置于左上角"}
            placement="top"
            className="capitalize"
          >
            <div>
              <PhQuestion></PhQuestion>
            </div>
          </Tooltip>
          :
        </span>
        <div className="flex items-center">
          <AInput
            placeholder="x"
            className="w-[50px] ml-2 rounded-md"
            size="xs"
            radius="md"
          />
          <AInput
            placeholder="y"
            className="w-[50px] ml-2 rounded-md"
            size="xs"
            radius="md"
          />
        </div>
      </div>
    </div>
  );
});
const tabs = [
  {
    id: "panel",
    label: "面板设置",
    content: <PanelSetting></PanelSetting>,
  },
  {
    id: "page",
    label: "容器配置",
    content: <ProviderSetting></ProviderSetting>,
  },
];

export const DefaultPanelSetting = memo(() => {
  return (
    <Card className="max-w-[300px] min-w-[300px]  rounded-none overflow-hidden h-full">
      <CardBody>
        <div className="flex w-full flex-col">
          <Tabs aria-label="panelset" items={tabs}>
            {(item) => (
              <Tab key={item.id} title={item.label}>
                <Card>
                  <CardBody>{item.content}</CardBody>
                </Card>
              </Tab>
            )}
          </Tabs>
        </div>
      </CardBody>
    </Card>
  );
});
