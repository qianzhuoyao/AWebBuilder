import { signalLogicNodeAttrConfig } from '../signalNodeConfig.ts';
import { logic_D_get } from '../../store/slice/nodeSlice.ts';
import {
  Tabs,
  Tab,
  CardBody,
  Card,
} from '@nextui-org/react';
import { RemoteBuilder, RemoteTest, RemoteUrl } from '../form/remoteReq/RemoteReqForm.tsx';


const tabs = [
  {
    id: 'url',
    label: 'Url',
    content: <RemoteUrl />,
  },
  {
    id: 'builder',
    label: '构建参数',
    content: <>
      <RemoteBuilder />
    </>,
  },
  {
    id: 'test',
    label: '测试',
    content: <>
      <RemoteTest />
    </>,
  },
];
export const remoteGetConfig = () => {
  const config = signalLogicNodeAttrConfig(logic_D_get);
  config.setConfigEle(nodeInfo => {
    if (nodeInfo.target.length > 0) {
      return <>
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

      </>;
    }
  });
};