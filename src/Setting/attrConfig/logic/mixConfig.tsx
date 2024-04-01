import { signalLogicNodeAttrConfig } from "../../signalNodeConfig.ts";
import { logic_MixData_get } from "../../../store/slice/nodeSlice.ts";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { DataMixForm } from "../../form/logic/mix/filter/dataMixForm.tsx";

export const handleMixConfig = () => {
  const config = signalLogicNodeAttrConfig(logic_MixData_get);

  config.setConfigEle((nodeInfo) => {
    if (nodeInfo.target.length > 0) {
      return (
        <>
          <div className="flex w-full flex-col px-1">
            <Tabs
              aria-label="Dynamic tabs"
              classNames={{
                panel: "p-1",
                base: "px-1",
              }}
            >
              <Tab key={nodeInfo.target[0] + "map"} title={"映射输入"}>
                <Card>
                  <CardBody>
                    <DataMixForm />
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
