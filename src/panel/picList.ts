import pixBX from "../assets/widgetIcon/bar_x.png";
import pixBY from "../assets/widgetIcon/bar_y.png";
import pixBLine from "../assets/widgetIcon/bar_line.png";
import pixLine from "../assets/widgetIcon/line.png";
import pixGLine from "../assets/widgetIcon/line_gradient_single.png";
import pixTable from "../assets/widgetIcon/table.png";
import pic from "../assets/widgetIcon/photo.png";
import pixText from "../assets/widgetIcon/text_static.png";
import {
  pic_Img,
  pix_BLine,
  pix_BX,
  pix_BY,
  pix_GLine,
  pix_Line,
  pix_Table,
  pix_Text,
} from "../store/slice/nodeSlice";

export const SRC_ICON = {
  table: [
    {
      id: pix_Table,
      src: pixTable,
      name: "表格",
    },
  ],
  text: [
    {
      id: pix_Text,
      src: pixText,
      name: "文本",
    },
  ],
  Image: [
    {
      id: pic_Img,
      src: pic,
      name: "图片资源",
    },
  ],
  line: [
    {
      id: pix_Line,
      src: pixLine,
      name: "条形图",
    },
    {
      id: pix_GLine,
      src: pixGLine,
      name: "面积图",
    },
  ],
  bar: [
    {
      id: pix_BX,
      src: pixBX,
      name: "普通柱状图",
    },
    {
      id: pix_BY,
      src: pixBY,
      name: "横向柱状图",
    },
    {
      id: pix_BLine,
      src: pixBLine,
      name: "折现柱状图",
    },
  ],
};
