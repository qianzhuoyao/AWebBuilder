import pixBX from '../assets/widgetIcon/bar_x.svg';
import pixLine from '../assets/widgetIcon/line.png';
import pixTable from '../assets/widgetIcon/table.svg';
import pic from '../assets/widgetIcon/photo.svg';
import pixText from '../assets/widgetIcon/text_static.svg';
import pixFrame from '../assets/widgetIcon/pepicons-pop--eye-frame.svg';
import pixInput from '../assets/widgetIcon/radix-icons--input.svg';
import {
  pic_Img,
  pix_BX, pix_frame, pix_input,
  pix_Line,
  pix_Table,
  pix_Text,
} from '../store/slice/nodeSlice';


export const SRC_ICON = {
  input: [{
    id: pix_input,
    src: pixInput,
    name: '输入',
  }],
  Frame: [
    {
      id: pix_frame,
      src: pixFrame,
      name: '网页',
    },
  ],
  table: [
    {
      id: pix_Table,
      src: pixTable,
      name: '表格',
    },
  ],
  text: [
    {
      id: pix_Text,
      src: pixText,
      name: '文本',
    },
  ],
  Image: [
    {
      id: pic_Img,
      src: pic,
      name: '图片资源',
    },
  ],
  line: [
    {
      id: pix_Line,
      src: pixLine,
      name: 'line线状',
    },

  ],
  bar: [
    {
      id: pix_BX,
      src: pixBX,
      name: '图表模板',
    },
    // {
    //   id: pix_BY,
    //   src: pixBY,
    //   name: "横向柱状图",
    // },
    // {
    //   id: pix_BLine,
    //   src: pixBLine,
    //   name: "折现柱状图",
    // },
  ],
};
