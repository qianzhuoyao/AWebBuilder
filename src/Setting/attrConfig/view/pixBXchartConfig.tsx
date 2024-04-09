//普通柱状图配置
import { signalViewNodeAttrConfig } from "../../signalNodeConfig.ts";
import { pix_BX } from "../../../store/slice/nodeSlice.ts";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { PixBXChartConfigCode } from "../../form/view/PixBXChartConfigCode.tsx";
import { DefaultViewNodeConfigForm } from "../../form/view/BXChartConfigForm.tsx";
import { StreamData } from "../../form/logic/remoteReq/StreamData.tsx";

export const PixBXChartConfig = () => {
  const config = signalViewNodeAttrConfig(pix_BX);
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
              <Tab key={nodeInfo.target[0] + "codeView"} title={"图表配置"}>
                <Card>
                  <CardBody>
                    <PixBXChartConfigCode />
                  </CardBody>
                </Card>
              </Tab>
              <Tab key={nodeInfo.target[0] + "config"} title={"组件配置"}>
                <Card>
                  <CardBody>
                    <DefaultViewNodeConfigForm />
                  </CardBody>
                </Card>
              </Tab>
              <Tab key={nodeInfo.target[0] + "params"} title={"流入数据"}>
                <Card>
                  <CardBody>
                    <StreamData id={nodeInfo.target[0]}/>
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
