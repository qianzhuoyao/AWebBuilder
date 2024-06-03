import { signalViewNodeAttrConfig } from "../../signalNodeConfig.ts";
import {
  pix_3d_frame,
  updateInstance,
} from "../../../store/slice/nodeSlice.ts";
import { Card, CardBody, Input, Tab, Tabs } from "@nextui-org/react";
import { DefaultViewNodeConfigForm } from "../../form/view/BXChartConfigForm.tsx";
import { StreamData } from "../../form/logic/remoteReq/StreamData.tsx";
import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { insertConfig } from "../../../node/viewConfigSubscribe.ts";
import { message, Upload } from "antd";
import { useTheme } from "next-themes";
import { SERVICE_PORT } from "../../../contant/index.ts";
import { useTakeNodeData } from "../../../comp/useTakeNodeData.tsx";

const ImageConfigSetting = memo(() => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const NodesState = useTakeNodeData();

  const onUpdateSrc = useCallback(
    (value: string) => {
      try {
        insertConfig(NodesState.targets[0], {
            A3durl: value,
        });
        dispatch(
          updateInstance({
            type: NodesState.list[NodesState.targets[0]].instance.type,
            id: NodesState.targets[0],
            option: {
              ...NodesState.list[NodesState.targets[0]]?.instance?.option,
              A3durl: value,
            },
          })
        );
      } catch (e) {
        console.error(e);
      }
    },
    [NodesState.list, NodesState.targets, dispatch]
  );

  const HOST =
    window.location.protocol +
    "//" +
    window.location.hostname +
    ":" +
    SERVICE_PORT;

  return (
    <div>
      <div>
        <small>资源</small>
        <Input
          type="text"
          placeholder="资源,可用过{}的形式取用流值路径"
          labelPlacement="outside"
          value={
            NodesState.list[NodesState.targets[0]]?.instance?.option?.A3durl || ""
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
            authorization: window.localStorage.getItem("token") || "",
          }}
          style={{
            color: theme === "light" ? "#000" : "#fff",
          }}
          className="avatar-uploader"
          showUploadList={false}
          accept="image"
          maxCount={1}
          action=""
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
          <small
            className="cursor-pointer"
            style={{
              color: theme === "light" ? "#000" : "#fff",
            }}
          >
            上传
          </small>
        </Upload>
      </div>
    </div>
  );
});
export const I3dConfig = () => {
  const config = signalViewNodeAttrConfig(pix_3d_frame);
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
                title={"3d配置"}
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
