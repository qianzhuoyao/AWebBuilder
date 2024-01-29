import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { WidgetIconTemp } from "./widgetIconTemp";
import { SRC_ICON } from "./picList";
import React from "react";

interface ITs {
  ele: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
}

export const ChartIcon = () => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <svg
        width={24}
        height={24}
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 32 32"
      >
        <path
          d="M12 30H4a2.002 2.002 0 0 1-2-2v-4a2.002 2.002 0 0 1 2-2h8a2.002 2.002 0 0 1 2 2v4a2.002 2.002 0 0 1-2 2zm-8-6v4h8v-4z"
          fill="currentColor"
        ></path>
        <path
          d="M28 20H12a2.002 2.002 0 0 1-2-2v-4a2.002 2.002 0 0 1 2-2h16a2.002 2.002 0 0 1 2 2v4a2.002 2.002 0 0 1-2 2zm-16-6v4h16v-4z"
          fill="currentColor"
        ></path>
        <path
          d="M16 10H4a2.002 2.002 0 0 1-2-2V4a2.002 2.002 0 0 1 2-2h12a2.002 2.002 0 0 1 2 2v4a2.002 2.002 0 0 1-2 2zM4 4v4h12V4z"
          fill="currentColor"
        ></path>
      </svg>
      <span className="text-center">图表</span>
    </div>
  );
};

export const TableIcon = () => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <svg
        width={24}
        height={24}
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 32 32"
      >
        <path
          d="M27 3H5a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 2v4H5V5zm-10 6h10v7H17zm-2 7H5v-7h10zM5 20h10v7H5zm12 7v-7h10v7z"
          fill="currentColor"
        ></path>
      </svg>
      <span>表格</span>
    </div>
  );
};

export const ImageIcon = () => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <svg
        width={24}
        height={24}
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 512 512"
      >
        <rect
          x="48"
          y="80"
          width="416"
          height="352"
          rx="48"
          ry="48"
          fill="none"
          stroke="currentColor"
          stroke-linejoin="round"
          stroke-width="32"
        ></rect>
        <circle
          cx="336"
          cy="176"
          r="32"
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
        ></circle>
        <path
          d="M304 335.79l-90.66-90.49a32 32 0 0 0-43.87-1.3L48 352"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        ></path>
        <path
          d="M224 432l123.34-123.34a32 32 0 0 1 43.11-2L464 368"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        ></path>
      </svg>
      <span>资源</span>
    </div>
  );
};
export const TextIcon = () => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <svg
        width={24}
        height={24}
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 32 32"
      >
        <path
          d="M20 22h2l-5-12h-2l-5 12h2l1.24-3h5.53zm-5.93-5l1.82-4.42h.25L18 17z"
          fill="currentColor"
        ></path>
        <path
          d="M12 28H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v11h-2V6H6v20h6z"
          fill="currentColor"
        ></path>
        <path
          d="M23 27.18l-2.59-2.59L19 26l4 4l7-7l-1.41-1.41L23 27.18z"
          fill="currentColor"
        ></path>
      </svg>
      <span>文本</span>
    </div>
  );
};


const TextMap =()=>{
    return (
        <div className="space-y-2">
          {SRC_ICON.text.map((text) => {
            return (
              <div key={text.id}>
                <WidgetIconTemp src={text.src} name={text.name}></WidgetIconTemp>
              </div>
            );
          })}
        </div>
      );
}

const ImageMap =()=>{
    return (
        <div className="space-y-2">
          {SRC_ICON.Image.map((image) => {
            return (
              <div key={image.id}>
                <WidgetIconTemp src={image.src} name={image.name}></WidgetIconTemp>
              </div>
            );
          })}
        </div>
      );
}
const TableMap = () => {
  return (
    <div className="space-y-2">
      {SRC_ICON.table.map((table) => {
        return (
          <div key={table.id}>
            <WidgetIconTemp src={table.src} name={table.name}></WidgetIconTemp>
          </div>
        );
      })}
    </div>
  );
};
const LineMap = () => {
  return (
    <div className="space-y-2">
      {SRC_ICON.line.map((line) => {
        return (
          <div key={line.id}>
            <WidgetIconTemp src={line.src} name={line.name}></WidgetIconTemp>
          </div>
        );
      })}
    </div>
  );
};

const BarMap = () => {
  return (
    <div className="space-y-2">
      {SRC_ICON.bar.map((bar) => {
        return (
          <div key={bar.id}>
            <WidgetIconTemp src={bar.src} name={bar.name}></WidgetIconTemp>
          </div>
        );
      })}
    </div>
  );
};

export const TextTabs =[
    {
        id: "TextContent",
        label: "文本",
        content: <TextMap></TextMap>,
      },
]

export const ImageTabs=[
    {
        id: "PicContent",
        label: "图片资源",
        content: <ImageMap></ImageMap>,
      },
]

export const TableTabs = [
  {
    id: "TableChartContent",
    label: "表格",
    content: <TableMap></TableMap>,
  },
];

export const ChartTabs = [
  {
    id: "bXChartContent",
    label: "柱状图",
    content: <BarMap></BarMap>,
  },
  {
    id: "lChartContent",
    label: "折线图",
    content: <LineMap></LineMap>,
  },
];

const TabSlot: React.FC<ITs> = ({ ele }) => {
  return (
    <div className="flex h-[100%]">
      <Tabs
        aria-label="Dynamic tabs"
        items={ele}
        color="primary"
        radius="none"
        classNames={{
          tabList: "flex flex-col",
          panel: "p-0 bg-default-100 h-[100%] w-[100%]",
          cursor: "rounded-md",
          base: "bg-default-100",
        }}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            <Card className="rounded-none h-[100%]">
              <CardBody>{item.content}</CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

const tabs = [
  {
    id: "chart",
    label: <ChartIcon />,
    content: <TabSlot ele={ChartTabs}></TabSlot>,
  },
  {
    id: "table",
    label: <TableIcon />,
    content: <TabSlot ele={TableTabs}></TabSlot>,
  },
  {
    id: "image",
    label: <ImageIcon />,
    content: <TabSlot ele={ImageTabs}></TabSlot>,},
  {
    id: "text",
    label: <TextIcon />,
    content: <TabSlot ele={TextTabs}></TabSlot>
 },
];
export const WidgetMenu = () => {
  return (
    <div className="flex h-[100%]">
      <Tabs
        aria-label="Dynamic tabs"
        color="primary"
        items={tabs}
        radius="none"
        classNames={{
          tab: "h-[80px]",
          tabList: "flex flex-col",
          panel: "p-0 bg-default-100 h-[100%] w-[100%]",
          cursor: "rounded-md",
          base: "bg-default-100",
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
