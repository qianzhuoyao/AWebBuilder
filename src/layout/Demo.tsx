//预览


import { BaseChart } from '../node/chart.tsx';

export const Demo = () => {
  const previewData = window.localStorage.getItem('DEMO-NODE#');
  const previewPanelData = window.localStorage.getItem('DEMO-PANEL#');
  if (previewData && previewPanelData) {
    const data = JSON.parse(previewData);
    const panel = JSON.parse(previewPanelData);
    return <div style={{
      width: panel.panelWidth + 'px',
      height: panel.panelHeight + 'px',
      background: panel.panelColor,
      overflow: 'hidden',
    }}>{
      Object.values(data.list).map(node => {
        if (node.classify === 'chart') {
          return (
            <BaseChart
              type={node.instance.type}
              width={node.w}
              height={node.w}
              options={node.instance.option}
            ></BaseChart>
          );
        } else {
          return <>-</>;
        }
      })
    }</div>;
  }
  return <>预览失败</>;
};