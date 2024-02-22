//普通柱状图配置
import { signalViewNodeAttrConfig } from '../../signalNodeConfig.ts';
import { pix_BX } from '../../../store/slice/nodeSlice.ts';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import { PixBXChartConfigCode } from '../../form/view/PixBXChartConfigCode.tsx';
import { PixBXChartConfigForm } from '../../form/view/BXChartConfigForm.tsx';


const chartTabs = [
  {
    id: 'codeView',
    label: '代码',
    content: <>
      <PixBXChartConfigCode />
    </>,
  },
  {
    id: 'config',
    label: '配置',
    content: < PixBXChartConfigForm />,
  },
];

export const PixBXChartConfig = () => {
  const config = signalViewNodeAttrConfig(pix_BX);
  config.setConfigEle(nodeInfo => {
    if (nodeInfo.target.length > 0) {
      return <>
        <div className="flex w-full flex-col px-1">
          <Tabs aria-label="Dynamic tabs" items={chartTabs} classNames={{
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