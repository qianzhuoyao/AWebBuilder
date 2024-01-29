import { Icon } from "@iconify-icon/react";
import { Tabs, Tab, Card, CardBody,Button } from "@nextui-org/react";
import { AInput } from "../comp/AInput";
import { WidgetMenu } from "./widgetMenu";

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
    label: "视图",
    content: (
      <>
        <ToolHeader></ToolHeader>
        <WidgetMenu></WidgetMenu>
      </>
    ),
  },
  {
    id: "logic",
    label: "逻辑",
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
  return (
    <div className="w-[300px] min-w-[300px] h-full relative">
      <div className="absolute right-[10px] top-[1px]">
        <Button className="ml-2" isIconOnly size="sm" variant="light" aria-label="locale">
          <Icon icon="mingcute:layer-fill" width={"16px"} height={"16px"} />
        </Button>
        <Button className="ml-2" isIconOnly size="sm" variant="light" aria-label="locale">
          <Icon icon="tabler:list-details" width={"16px"} height={"16px"} />
        </Button>
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
  );
};
