import { ChartTemplate } from "./chartTemplate";
import { IframeTemplate } from "./frameTemplate";
import { ImageTemplate } from "./imageTemplate";
import { TableTemplate } from "./tableTemplate";

export const templateMain = () => {
  ChartTemplate();
  TableTemplate();
  ImageTemplate();
  IframeTemplate()
};
