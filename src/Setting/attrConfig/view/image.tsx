import { signalViewNodeAttrConfig } from "../../signalNodeConfig.ts";
import {
  INs,
  pic_Img,
  updateInstance,
} from "../../../store/slice/nodeSlice.ts";
import { Card, CardBody, Input, Tab, Tabs } from "@nextui-org/react";
import { DefaultViewNodeConfigForm } from "../../form/view/BXChartConfigForm.tsx";
import { StreamData } from "../../form/logic/remoteReq/StreamData.tsx";
import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { insertConfig } from "../../../node/viewConfigSubscribe.ts";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { useTheme } from "next-themes";

const props: UploadProps = {
  name: "file",
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const ImageConfigSetting = memo(() => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });

  const onUpdateSrc = useCallback(
    (value: string) => {
      insertConfig(NodesState.targets[0], {
        src: value,
      });
      dispatch(
        updateInstance({
          type: NodesState.list[NodesState.targets[0]].instance.type,
          id: NodesState.targets[0],
          option: {
            ...NodesState.list[NodesState.targets[0]]?.instance?.option,
            src: value,
          },
        })
      );
    },
    [NodesState.list, NodesState.targets, dispatch]
  );
  return (
    <div>
      <div>
        <small>资源</small>
        <Input
          type="text"
          placeholder="资源"
          labelPlacement="outside"
          value={
            NodesState.list[NodesState.targets[0]]?.instance?.option?.src || ""
          }
          // value={NodesState.list[NodesState.targets[0]].instance.option?.src || ''}
          onChange={(e) => {
            onUpdateSrc(e.target.value);
          }}
        />
      </div>
      <div>
        <Upload
          {...props}
          className={`text-[${theme === "light" ? "#000" : "#fff"}]`}
        >
          <small className="cursor-pointer">上传</small>
        </Upload>
      </div>
    </div>
  );
});
export const ImageConfig = () => {
  const config = signalViewNodeAttrConfig(pic_Img);
  config.setConfigEle((nodeInfo) => {
    if (nodeInfo.target.length > 0) {
      return (
        <>
          <div className="flex w-full flex-col px-1">
            <Tabs
              aria-label="chart config"
              classNames={{
                panel: "p-1",
                base: "px-1",
              }}
            >
              <Tab
                key={nodeInfo.target[0] + "TableConfigSetting"}
                title={"图表配置"}
              >
                <Card>
                  <CardBody>
                    <ImageConfigSetting></ImageConfigSetting>
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key={nodeInfo.target[0] + "DefaultViewNodeConfigForm"}
                title={"组件配置"}
              >
                <Card>
                  <CardBody>
                    <DefaultViewNodeConfigForm />
                  </CardBody>
                </Card>
              </Tab>
              <Tab key={nodeInfo.target[0] + "StreamData"} title={"流入数据"}>
                <Card>
                  <CardBody>
                    <StreamData id={nodeInfo.target[0]} />
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </>
      );
    }
  });
};
