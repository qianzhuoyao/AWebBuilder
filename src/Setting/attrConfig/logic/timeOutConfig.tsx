import { IConfigTypeParams } from './configType.ts';
import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { logic_Ring_get, logic_TO_get } from '../../../store/slice/nodeSlice.ts';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import { TimeOutConfig } from '../../form/logic/timer/timeOut.tsx';

export const TimerOutConfig = (configParams: IConfigTypeParams) => {
  const config = signalLogicNodeAttrConfig(logic_TO_get);
  config.setConfigEle((nodeInfo) => {
    if (nodeInfo.target.length > 0) {
      return <>
        <div className="flex w-full flex-col px-1">
          <Tabs aria-label="Dynamic tabs"
                classNames={{
                  panel: 'p-1',
                  base: 'px-1',
                }}>
            <Tab title={'设置'}>
              <Card>
                <CardBody>
                  <TimeOutConfig />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>

      </>;
    }
  });

};