import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import { ILogicTypeList } from "../../panel/logicSrcList.ts";
import { ITableConfig } from "../../node/viewConfigSubscribe.ts";
import {
  IFRAME_DEFAULT_OPTION,
  IMAGE_DEFAULT_OPTION,
  ITEXT_DEFAULT_OPTION,
} from "../../comp/setDefaultChartOption.ts";
import { CHART_OPTIONS } from "../../Setting/attrConfig/view/CHART_OPTIONS.ts";
import {
  emitBlockDisplayBox,
  emitBlockHideBox,
  emitBlockReRender,
  emitBlockSetPosition,
} from "../../emit/emitBlock.ts";
//pixTable
export const pix_Table = "pixTable" as const;
export const pix_frame = "pix_frame" as const;
export const pix_input = "pix_input" as const;
//文本
export const pix_Text = "pixText" as const;
//图片资源
export const pic_Img = "pic" as const;

//条形图
export const pix_Line = "pixLine" as const;
//面积图
export const pix_GLine = "pixGLine" as const;
//普通柱状图
export const pix_BX = "pixBX" as const;
//横向柱状图
export const pix_BY = "pixBY" as const;
//折现柱状图
export const pix_BLine = "pixBLine" as const;

//关于信号的说明，0/1 当存在型号时，信号边为1 否则为0
//逻辑 数据获取器
export const logic_D_get = "logic_D_get" as const;
//逻辑 提交数据
export const logic_U_get = "logic_U_get" as const;
//缓存器
export const logic_Cache_set = "logic_Cache_set" as const;
//清理所有缓存
export const logic_Cache_clear = "logic_Cache_clear" as const;
//校验器 当信号输入值与设置值相等时通过，否则拦截
export const logic_P_get = "logic_P_set" as const;

//映射字段
export const logic_MixData_get = "logic_MixData_get" as const;
//表单构建
export const logic_Form_get = "logic_Form_get" as const;
//加密器
export const logic_ENC_get = "logic_ENC_get" as const;
//过滤数据
export const logic_FilterData_get = "logic_FilterData_get" as const;
//过滤数据
export const logic_FilterCheckData_get = "logic_FilterCheckData_get" as const;
//信号转换器，输入的信号不满足条件时 不丢弃 并继续发送一条 信息用以通知
export const logic_TM_get = "logic_TM_get" as const;
//定时器
export const logic_TO_get = "logic_TO_get" as const;
export const logic_NOT_BOTH_get = "logic_NOT_BOTH_get" as const;
export const logic_or_BOTH_get = "logic_or_BOTH_get" as const;
export const logic_and_BOTH_get = "logic_and_BOTH_get" as const;
//组件映射
export const logic_View_bind = "logic_View_bind" as const;
//循环
export const logic_Ring_get = "logic_Ring_get" as const;
//load开始
export const logic_Load_start = "logic_Load_start" as const;
//打平
export const logic_Roll_get = "logic_Roll_get" as const;
//定次
export const logic_TimesSet_get = "logic_TimesSet_get" as const;
//手动触发
export const logic_Dug_Trigger = "logic_Dug_Trigger" as const;
//时间
export const logic_Day_shift_Trigger = "logic_Day_shift_Trigger" as const;
export type ILogicType =
  | typeof logic_Cache_clear
  | typeof logic_D_get
  | typeof logic_U_get
  | typeof logic_Cache_set
  | typeof logic_Load_start
  | typeof logic_P_get
  | typeof logic_Roll_get
  | typeof logic_TM_get
  | typeof logic_TO_get
  | typeof logic_Dug_Trigger
  | typeof logic_ENC_get
  | typeof logic_Day_shift_Trigger
  | typeof logic_Form_get
  | typeof logic_Ring_get
  | typeof logic_View_bind
  | typeof logic_FilterData_get
  | typeof logic_NOT_BOTH_get
  | typeof logic_and_BOTH_get
  | typeof logic_or_BOTH_get
  | typeof logic_FilterCheckData_get
  | typeof logic_MixData_get
  | typeof logic_TimesSet_get;

export type INodeType =
  | typeof pix_BLine
  | typeof logic_TM_get
  | typeof pix_frame
  | typeof pix_input
  | typeof pix_Table
  | typeof pix_BY
  | typeof pix_BX
  | typeof pix_GLine
  | typeof pix_Line
  | typeof pic_Img
  | typeof pix_frame
  | typeof pix_Text
  | ILogicType
  | keyof typeof CHART_OPTIONS;

export type IOptionInstance = Partial<
  {
    chartClass: keyof typeof CHART_OPTIONS;
    chart: string;
  } & ITableConfig &
    typeof IMAGE_DEFAULT_OPTION &
    typeof IFRAME_DEFAULT_OPTION &
    typeof ITEXT_DEFAULT_OPTION
>;

interface IChartInstance {
  option?: IOptionInstance;
  type: INodeType;
}

export type IIstance = IChartInstance;

enableMapSet();

export type IClassify = ILogicTypeList;

export interface IViewNode {
  //标识
  id: string;
  //基于面板的横坐标
  x: number;
  //基于面板的纵坐标
  y: number;
  //基于面板的长度
  w: number;
  //基于面板的高度
  h: number;
  //基于面板的层级
  z: number;
  //基于面板的旋转度
  r: number;

  //别名
  alias: string;
  //所属分类id
  typeId: string;
  //说明
  desc: string;
  //拷贝自
  copyBy?: string;
  //分类
  classify: IClassify;
  //实例容器
  instance: IIstance;
  nodeType: "VIEW" | "LOGIC";
  transform?: string;
}

type nodeId = string;

export interface INs {
  targets: string[];
  list: Record<nodeId, IViewNode>;
}

export const viewNodesSlice = createSlice({
  name: "nodes",
  initialState: {
    list: {},
    targets: [],
  } as INs,
  reducers: {
    updateRotate: (
      state,
      action: PayloadAction<{ id: string; rotate: number }>
    ) => {
      const { id, rotate } = action.payload;
      (state.list as Record<string, IViewNode>)[id].r = rotate;
    },
    updateAlias: (state, action) => {
      const { id, alias } = action.payload;
      (state.list as Record<string, IViewNode>)[id].alias = alias;
    },
    updateZ: (
      state,
      action: PayloadAction<{
        id: string;
        zIndex: number;
      }>
    ) => {
      const { id, zIndex } = action.payload;
      (state.list as Record<string, IViewNode>)[id].z = zIndex;
    },
    updateInstance: (state, action) => {
      const { type, id, option } = action.payload;
      const viewNodeTypeIdList = [
        pix_Table,
        pix_Text,
        pic_Img,
        pix_BX,
        pix_frame,
        pix_Text,
      ];
      //是视图
      if (viewNodeTypeIdList.includes(type)) {
        (state.list as Record<string, IViewNode>)[id].instance.option = option;
      }
    },
    clear: (state) => {
      state.list = {};
    },
    deleteListItem: (state, action) => {
      const { idList } = action.payload;
      if (Array.isArray(idList)) {
        const newList: Record<nodeId, IViewNode> = {};
        Object.keys(state.list).map((key) => {
          if (!idList.includes(key)) {
            newList[key] = (state.list as Record<string, IViewNode>)[key];
          }
        });
        state.list = newList;
      }
    },

    updateTargets: (state, action: PayloadAction<string[]>) => {
      if (action.payload.length) {
        emitBlockDisplayBox();
      } else {
        emitBlockHideBox();
      }
      state.targets = action.payload;
    },
    updateSize: (
      state,
      action: PayloadAction<{
        id: string;
        w: number;
        h: number;
      }>
    ) => {
      const findNode = (state.list as Record<string, IViewNode>)[
        action.payload.id || ""
      ];

      if (findNode) {
        const newNode = {
          ...findNode,
          w: action.payload.w ?? findNode.w,
          h: action.payload.h ?? findNode.h,
        };
        state.list = { ...state.list, [action.payload.id]: newNode };
      }
    },
    updatePosition: (
      state,
      action: PayloadAction<{
        id: string;
        x?: number;
        y?: number;
        transform?: string;
      }>
    ) => {
      const findNode = (state.list as Record<string, IViewNode>)[
        action.payload.id || ""
      ];
      if (findNode) {
        const newNode = {
          ...findNode,
          x: action.payload.x ?? findNode.x,
          y: action.payload.y ?? findNode.y,
        };
        console.log({ ...findNode }, "findNodesssss");
        emitBlockSetPosition({
          x: action.payload.x ?? findNode.x,
          y: action.payload.y ?? findNode.y,
        });
        emitBlockReRender();
        const mergeTransform = action.payload.transform
          ? { transform: action.payload.transform }
          : {};
        state.list = {
          ...state.list,
          [action.payload.id]: { ...newNode, ...mergeTransform },
        };
      }
    },
    setList: (state, action) => {
      state.list = action.payload;
    },
    cloneNode: (state, action) => {
      state.list = {
        ...state.list,
        [action.payload.id]: action.payload,
      };
    },
    addNode: (state, action) => {
      state.list = {
        ...state.list,
        [action.payload.id]: action.payload,
      };
      // (state.list as Record<string, IViewNode>)[action.payload.id] =
      //   action.payload;
    },
  },
});

export const {
  updateAlias,
  setList,
  updateZ,
  updateInstance,
  addNode,
  cloneNode,
  updateTargets,
  clear,
  updateRotate,
  updatePosition,
  deleteListItem,
  updateSize,
} = viewNodesSlice.actions;

export default viewNodesSlice.reducer;
