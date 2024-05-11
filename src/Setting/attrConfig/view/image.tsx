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
import { ICs } from "../../../store/slice/configSlice.ts";
import { SERVICE_PORT } from "../../../contant/index.ts";
import { useTakeNodeData } from "../../../comp/useTakeNodeData.tsx";
import { useTakeConfig } from "../../../comp/useTakeStore.tsx";

const ImageConfigSetting = memo(() => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const NodesState = useTakeNodeData()
  const ConfigState = useTakeConfig()
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


  const HOST = window.location.protocol +
    "//" +
    window.location.hostname +
    ":" +
    SERVICE_PORT

  const props: UploadProps = {
    name: "file",
    action: `/mwapi/visualize/visualizeView/upload`,
    // action: `http://10.180.5.186:30081/mwapi/visualize/visualizeView/upload`,
    headers: {
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Methods': "*",
      'Access-Control-Allow-Headers': "*",
      authorization: ConfigState?.contentList?.token || "",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        if (info.file.response.rtnCode === 200) {
          onUpdateSrc(
            `${HOST}/visualize_download/${info.file.response.data}`
          );
        }
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div>
      <div>
        <small>资源</small>
        <Input
          type="text"
          placeholder="资源,可用过{}的形式取用流值路径"
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
          name="file"
          headers={{
            authorization: window.localStorage.getItem('token') || '',
          }}
          style={{
            color: theme === "light" ? "#000" : "#fff"
          }}
          className="avatar-uploader"
          showUploadList={false}
          accept='image'
          maxCount={1}
          action="/mwapi/visualize/visualizeView/upload"
          onChange={(info) => {
            if (info.file.status !== "uploading") {
              console.log(info.file, info.fileList);
            }
            if (info.file.status === "done") {
              message.success(`${info.file.name} file uploaded successfully`);
              if (info.file.response.rtnCode === 200) {
                onUpdateSrc(
                  `${HOST}/visualize_download/${info.file.response.data}`
                );
              }
            } else if (info.file.status === "error") {
              message.error(`${info.file.name} file upload failed.`);
            }
          }}
        >
          <small className="cursor-pointer">上传</small>
        </Upload>
        {/* <Upload
          {...props}
          style={{
            color: theme === "light" ? "#000" : "#fff"
          }}

        >
          <small className="cursor-pointer">上传</small>
        </Upload> */}
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
