import {
  Card,
  Tabs,
  CardBody,
  CardFooter,
  Tab,
  Link,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Input,
} from "@nextui-org/react";
import { SketchPicker } from "react-color";
import { Icon } from "@iconify-icon/react";
import { AInput } from "../comp/AInput";
import { useState } from "react";

const ColorPick = () => {
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
        {() => (
          <div className="px-1 py-2 w-full">
            <SketchPicker />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

const ProviderSetting = () => {
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
          />
        </div>
        <div className="flex items-center">
          <small className="w-[30px]">宽</small>
          <AInput
            placeholder="宽"
            className="w-[80px] rounded-md"
            size="xs"
            radius="md"
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
          />
        </div>
        <div className="flex items-center">
          <small className="w-[30px]">y</small>
          <AInput
            placeholder="y"
            className="w-[80px] rounded-md"
            size="xs"
            radius="md"
          />
        </div>
      </div>
      <div className="flex justify-center py-3">
        <div className="flex flex-col items-center">
          <Icon
            className="cursor-pointer"
            icon="icon-park-twotone:upload-web"
            height={130}
            width={130}
          />
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
          <Button size="sm" className="mr-2">清除背景图片</Button>
          <Button size="sm">清除背景颜色</Button>
        </div>
      </div>
    </div>
  );
};

let tabs = [
  {
    id: "panel",
    label: "面板设置",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "page",
    label: "容器配置",
    content: <ProviderSetting></ProviderSetting>,
  },
];

export const AttrSetting = () => {
  return (
    <Card className="max-w-[300px] min-w-[300px]  rounded-none">
      <CardBody>
        <div className="flex w-full flex-col">
          <Tabs aria-label="Dynamic tabs" items={tabs}>
            {(item) => (
              <Tab key={item.id} title={item.label}>
                <Card>
                  <CardBody>{item.content}</CardBody>
                </Card>
              </Tab>
            )}
          </Tabs>
        </div>{" "}
      </CardBody>
    </Card>
  );
};
