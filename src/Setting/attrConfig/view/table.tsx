//普通柱状图配置
import { signalViewNodeAttrConfig } from '../../signalNodeConfig.ts';
import { pix_Table } from '../../../store/slice/nodeSlice.ts';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';


const chartTabs = [
  {
    id: 'codeView',
    label: '图表配置',
    content: <>

    </>,
  },
  {
    id: 'config',
    label: '组件配置',
    content: <></>,
  },
  {
    id: 'params',
    label: '流入数据',
    content: <></>,
  },
];

export const TableConfig = () => {
  const config = signalViewNodeAttrConfig(pix_Table);
  config.setConfigEle(nodeInfo => {
    if (nodeInfo.target.length > 0) {
      return <>
        <div className="flex w-full flex-col px-1">
          <Tabs aria-label="chart config" items={chartTabs} classNames={{
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