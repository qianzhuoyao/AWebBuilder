import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { logic_View_bind } from '../../../store/slice/nodeSlice.ts';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import { useSelector } from 'react-redux';
import { ILs } from '../../../store/slice/logicSlice.ts';
import { ViewMappingForm } from '../../form/logic/viewMapping/viewMappingForm.tsx';


const tabs = [
  {
    id: 'bind',
    label: '绑定',
    content: <ViewMappingForm />,
  },
];
export const viewMapping = () => {
  const config = signalLogicNodeAttrConfig(logic_View_bind);

  config.setConfigEle(() => {
    const logicState = useSelector((state: { logicSlice: ILs }) => {
      return state.logicSlice;
    });
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
                      {item.content}
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