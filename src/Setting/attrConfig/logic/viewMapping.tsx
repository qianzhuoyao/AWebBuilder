import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { INs, logic_View_bind } from '../../../store/slice/nodeSlice.ts';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import { ViewMappingForm } from '../../form/logic/viewMapping/viewMappingForm.tsx';
import { ILs } from '../../../store/slice/logicSlice.ts';


export const viewMapping = ({ NodesState, logicState }: { NodesState: INs, logicState: ILs }) => {
  const config = signalLogicNodeAttrConfig(logic_View_bind);

  config.setConfigEle(({ target }) => {

    return <>
      {target.length === 1 ? <div className="flex w-full flex-col px-1">
        <>
          <div className="flex w-full flex-col px-1">
            <Tabs aria-label="Dynamic tabs" classNames={{
              panel: 'p-1',
              base: 'px-1',
            }}>
              <Tab key={target[0] + 'bind'} title={'绑定'}>
                <Card>
                  <CardBody>
                    <ViewMappingForm></ViewMappingForm>
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>

        </>
      </div> : <>选中项数量不对</>}
    </>;
  });
};