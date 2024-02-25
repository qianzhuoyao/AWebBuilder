import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { INs, logic_MixData_get } from '../../../store/slice/nodeSlice.ts';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import { DataMixForm } from '../../form/logic/mix/filter/dataMixForm.tsx';
import { ILs } from '../../../store/slice/logicSlice.ts';


const tabs = [
  {
    id: 'map',
    label: '映射输入',
    content: <>
      <DataMixForm />
    </>,
  },
];
export const handleMixConfig = ({NodesState,logicState}:{NodesState:INs,logicState:ILs}) => {
  const config = signalLogicNodeAttrConfig(logic_MixData_get);


  config.setConfigEle(nodeInfo => {
    if (nodeInfo.target.length > 0) {
      return <>
        <>
          <div className="flex w-full flex-col px-1">
            <Tabs aria-label="Dynamic tabs" items={tabs} classNames={{
              panel: 'p-1',
              base: 'px-1',
            }}>
              {(item) => (
                <Tab key={item.id} title={item.label}>
                  <Card>
                    <CardBody>
                      {item.content}
                    </CardBody>
                  </Card>
                </Tab>
              )}
            </Tabs>
          </div>

        </>

      </>;
    }
  });
};