import { signalViewNodeAttrConfig } from "../../signalNodeConfig.ts";
import {
  INs,
  pix_frame,
  updateInstance,
} from "../../../store/slice/nodeSlice.ts";
import { Card, CardBody, Input, Tab, Tabs } from "@nextui-org/react";
import { DefaultViewNodeConfigForm } from "../../form/view/BXChartConfigForm.tsx";
import { StreamData } from "../../form/logic/remoteReq/StreamData.tsx";
import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const IframeConfigSetting = memo(() => {
  const dispatch = useDispatch();
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });

  const onUpdateSrc = useCallback(
    (value: string) => {
      console.log(value, "useCallbackss");
      dispatch(
        updateInstance({
          type: NodesState.list[NodesState.targets[0]].instance.type,
          id: NodesState.list[NodesState.targets[0]].id,
          option: {
            ...NodesState.list[NodesState.targets[0]]?.instance?.option,
            url: value,
          },
        })
      );
    },
    [NodesState.list, NodesState.targets, dispatch]
  );
  return (
    <div>
      <div>
        <small>URL</small>
        <Input
          type="text"
          placeholder="资源"
          labelPlacement="outside"
          value={
            NodesState.list[NodesState.targets[0]]?.instance?.option?.url || ""
          }
          // value={NodesState.list[NodesState.targets[0]].instance.option?.src || ''}
          onChange={(e) => {
            onUpdateSrc(e.target.value);
          }}
        />
      </div>
    </div>
  );
});
export const IframeConfig = () => {
  const config = signalViewNodeAttrConfig(pix_frame);
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
                title={"网页配置"}
              >
                <Card>
                  <CardBody>
                    <IframeConfigSetting></IframeConfigSetting>
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
