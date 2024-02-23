import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { logic_Dug_Trigger } from '../../../store/slice/nodeSlice.ts';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import { useSelector } from 'react-redux';
import { ILs } from '../../../store/slice/logicSlice.ts';
import { TriggerOperation } from '../../form/logic/trigger/triggerOperation.tsx';
import { TriggerResponse } from '../../form/logic/trigger/triggerResponse.tsx';
import { useSignalMsg } from '../../../comp/msg.tsx';


const tabs = [
  {
    id: 'operation',
    label: '操作',
    content: (go: () => void) => <TriggerOperation go={go} />,
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

  config.setConfigEle(() => {
    const logicState = useSelector((state: { logicSlice: ILs }) => {
      return state.logicSlice;
    });
    const { go } = useSignalMsg(logicState.target[0]);
    return <>
      {logicState.target.length === 1 ? <div className="flex w-full flex-col px-1">
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
                      {item.content(go)}
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