import { IConfigTypeParams } from './configType.ts';
import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { logic_Ring_get } from '../../../store/slice/nodeSlice.ts';
import { TimeConfig } from '../../form/logic/timer/timeConfig.tsx';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';

export const TimerIntConfig = (configParams: IConfigTypeParams) => {
  const config = signalLogicNodeAttrConfig(logic_Ring_get);
  config.setConfigEle((nodeInfo) => {
    if (nodeInfo.target.length > 0) {
      return <>
        <div className="flex w-full flex-col px-1">
          <Tabs aria-label="Dynamic tabs"
                classNames={{
            panel: 'p-1',
            base: 'px-1',
          }}>
            <Tab title={'设置'} key={nodeInfo.target[0]}>
              <Card>
                <CardBody>
                  <TimeConfig />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>

      </>;
    }
  });

};