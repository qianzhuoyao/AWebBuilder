import { A3dTemplate } from "./3dTemplate";
import { ChartTemplate } from "./chartTemplate";
import { IframeTemplate } from "./frameTemplate";
import { ImageTemplate } from "./imageTemplate";
import { TableTemplate } from "./tableTemplate";
import { TextTemplate } from "./textTemplate";

export const templateMain = () => {
  ChartTemplate();
  TableTemplate();
  TextTemplate();
  ImageTemplate();
  IframeTemplate();
  A3dTemplate();
};
