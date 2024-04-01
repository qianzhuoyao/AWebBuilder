//普通柱状图配置
import { signalViewNodeAttrConfig } from "../../signalNodeConfig.ts";
import { pix_BX } from "../../../store/slice/nodeSlice.ts";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { PixBXChartConfigCode } from "../../form/view/PixBXChartConfigCode.tsx";
import { DefaultViewNodeConfigForm } from "../../form/view/BXChartConfigForm.tsx";
import { StreamData } from "../../form/logic/remoteReq/StreamData.tsx";

const chartTabs = [
  {
    id: "codeView",
    label: "图表配置",
    content: (
      <>
        <PixBXChartConfigCode />
      </>
    ),
  },
  {
    id: "config",
    label: "组件配置",
    content: <DefaultViewNodeConfigForm />,
  },
  {
    id: "params",
    label: "流入数据",
    content: <StreamData />,
  },
];

export const PixBXChartConfig = () => {
  const config = signalViewNodeAttrConfig(pix_BX);
  config.setConfigEle((nodeInfo) => {
    if (nodeInfo.target.length > 0) {
      return (
        <>
          <div className="flex w-full flex-col px-1">
            <Tabs
              aria-label="chart config"
              items={chartTabs}
              classNames={{
                panel: "p-1",
                base: "px-1",
              }}
            >
              {(item) => (
                <Tab key={nodeInfo.target[0] + item.id} title={item.label}>
                  <Card>
                    <CardBody>{item.content}</CardBody>
                  </Card>
                </Tab>
              )}
            </Tabs>
          </div>
        </>
      );
    }
  });
};
