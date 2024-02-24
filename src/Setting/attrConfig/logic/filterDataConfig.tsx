import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { logic_FilterData_get } from '../../../store/slice/nodeSlice.ts';
import { FilterDataForm } from '../../form/logic/mix/filter/FilterDataForm.tsx';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import { BuilderStruct } from '../../form/logic/mix/filter/builderStruct.tsx';


const tabs = [
  {
    id: 'config',
    label: '配置过滤',
    content: <FilterDataForm />,
  },
  {
    id: 'origin',
    label: '预设数据源',
    content: <BuilderStruct />,
  },
];

export const FilterDataConfig = () => {

  const config = signalLogicNodeAttrConfig(logic_FilterData_get);

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