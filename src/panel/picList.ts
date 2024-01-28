import pixBX from "../assets/widgetIcon/bar_x.png";
import pixBY from "../assets/widgetIcon/bar_y.png";
import pixBLine from "../assets/widgetIcon/bar_line.png";
import pixLine from "../assets/widgetIcon/line.png";
import pixGLine from "../assets/widgetIcon/line_gradient_single.png";
import pixTable from "../assets/widgetIcon/table.png";
import pic from "../assets/widgetIcon/photo.png";
import pixText from "../assets/widgetIcon/text_static.png";

export const SRC_ICON = {
  table: [
    {
      id: "pixTable",
      src: pixTable,
      name: "表格",
    },
  ],
  text: [
    {
      id: "pixText",
      src: pixText,
      name: "文本",
    },
  ],
  Image: [
    {
      id: "pic",
      src: pic,
      name: "图片资源",
    },
  ],
  line: [
    {
      id: "pixLine",
      src: pixLine,
      name: "条形图",
    },
    {
      id: "pixGLine",
      src: pixGLine,
      name: "面积图",
    },
  ],
  bar: [
    {
      id: "pixBX",
      src: pixBX,
      name: "普通柱状图",
    },
    {
      id: "pixBY",
      src: pixBY,
      name: "横向柱状图",
    },
    {
      id: "pixBLine",
      src: pixBLine,
      name: "折现柱状图",
    },
  ],
};
