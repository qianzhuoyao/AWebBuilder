import {
  INodeType,
  IOptionInstance,
  pic_Img,
  pix_3d_frame,
  pix_BX,
  pix_Table,
  pix_Text,
  pix_frame,
} from "../store/slice/nodeSlice.ts";
import pic from "../assets/widgetIcon/photo.svg";
import { CHART_OPTIONS } from "../Setting/attrConfig/view/CHART_OPTIONS.ts";
import { IText } from "../node/viewConfigSubscribe.ts";

export const parseFnContent = (str: string) => {
  const value = str.match(/{([\s\S]*)}/);
  return value ? value[0].slice(1).slice(0, -1) : "";
};

export const viewFnString = (body: string) => {
  return `
  ${body}
  `;
};

export const runViewFnString = (body: string) => {
  return `
  function builder(params,echarts){
  ${body}
  }
  `;
};

export const TABLE_DEFAULT_OPTION = {
  colField: "col",
  colLabel: "label",
  colProp: "prop",
  dataField: "data",
};

export const IMAGE_DEFAULT_OPTION = {
  src: pic,
} as const;

export const IFRAME_DEFAULT_OPTION = {
  url: "",
} as const;

export const IFRAME_3D_DEFAULT_OPTION = {
  A3durl: "",
} as const;

export const ITEXT_DEFAULT_OPTION: IText = {
  text: "文本",
  color: "black",
  fontSize: "12px",
  fontWeight: 500,
  fontFamily: "",
} as const;

export const setDefaultChartOption = (type: INodeType): IOptionInstance => {
  console.log(type, "setDefaultChartOptions");
  switch (type) {
    case pix_BX:
      return {
        chartClass: "普通柱状",
        chart: CHART_OPTIONS["普通柱状"],
      };
    case pix_Table:
      return TABLE_DEFAULT_OPTION;
    case pic_Img:
      return IMAGE_DEFAULT_OPTION;
    case pix_frame:
      return IFRAME_DEFAULT_OPTION;
    case pix_3d_frame:
      return IFRAME_3D_DEFAULT_OPTION;
    case pix_Text:
      return ITEXT_DEFAULT_OPTION;
    default:
      throw new Error("unknown option type");
  }
};
