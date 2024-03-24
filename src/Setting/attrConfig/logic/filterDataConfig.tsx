import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { logic_FilterCheckData_get } from '../../../store/slice/nodeSlice.ts';
import { FilterDataForm } from '../../form/logic/mix/filter/FilterDataForm.tsx';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';


export const FilterDataConfig = () => {

  const config = signalLogicNodeAttrConfig(logic_FilterCheckData_get);

  config.setConfigEle(nodeInfo => {
    if (nodeInfo.target.length > 0) {
      return <>
        <>
          <div className="flex w-full flex-col px-1">
            <Tabs aria-label="Dynamic tabs" classNames={{
              panel: 'p-1',
              base: 'px-1',
            }}>
              <Tab key={nodeInfo.target[0] + 'config'} title={'配置过滤'}>
                <Card>
                  <CardBody>
                    <FilterDataForm />
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>

        </>

      </>;
    }
  });
};