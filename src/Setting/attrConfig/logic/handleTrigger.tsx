import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { INs, logic_Dug_Trigger } from '../../../store/slice/nodeSlice.ts';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import { TriggerOperation } from '../../form/logic/trigger/triggerOperation.tsx';
import { TriggerResponse } from '../../form/logic/trigger/triggerResponse.tsx';
import { ILs } from '../../../store/slice/logicSlice.ts';


export const handleTrigger = ({NodesState,logicState}:{NodesState:INs,logicState:ILs}) => {
  const config = signalLogicNodeAttrConfig(logic_Dug_Trigger);


  config.setConfigEle(({ target, go }) => {
    console.log(go, target, 'ssssssswsgo');

    return <>
      {target?.length === 1 ? <div className="flex w-full flex-col px-1">
        <>
          <div className="flex w-full flex-col px-1">
            <Tabs
              aria-label="Dynamic tabs"
              classNames={{
                panel: 'p-1',
                base: 'px-1',
              }}>
              <Tab key={'operation'} title={'操作'}>
                <Card>
                  <CardBody>
                    <TriggerOperation go={go} target={target[0]} />
                  </CardBody>
                </Card>
              </Tab>
              {/*<Tab key={'result'} title={'响应'}>*/}
              {/*  <Card>*/}
              {/*    <CardBody>*/}
              {/*      <TriggerResponse />*/}
              {/*    </CardBody>*/}
              {/*  </Card>*/}
              {/*</Tab>*/}
            </Tabs>
          </div>

        </>
      </div> : <>选中项数量不对</>}
    </>;
  });
};