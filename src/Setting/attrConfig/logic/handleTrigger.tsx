import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { logic_Dug_Trigger } from '../../../store/slice/nodeSlice.ts';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import { TriggerOperation } from '../../form/logic/trigger/triggerOperation.tsx';
import { TriggerResponse } from '../../form/logic/trigger/triggerResponse.tsx';



const tabs = [
  {
    id: 'operation',
    label: '操作',
    content: ({ go }: { go?: () => Promise<void> }) => <TriggerOperation go={go} />,
  },
  {
    id: 'result',
    label: '响应',
    content: () => <>
      <TriggerResponse />
    </>,
  },
];
export const handleTrigger = () => {
  const config = signalLogicNodeAttrConfig(logic_Dug_Trigger);


  config.setConfigEle(({ target, go }) => {
    console.log(go, 'ssssssswsgo');
    return <>
      {target?.length === 1 ? <div className="flex w-full flex-col px-1">
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
                      {item.content({ go })}
                    </CardBody>
                  </Card>
                </Tab>
              )}
            </Tabs>
          </div>

        </>
      </div> : <>选中项数量不对</>}
    </>;
  });
};