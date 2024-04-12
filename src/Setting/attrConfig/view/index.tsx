import { PixBXChartConfig } from "./pixBXchartConfig.tsx";
import { signalViewNodeAttrConfig } from "../../signalNodeConfig.ts";
import { DefaultPanelSetting } from "./panelSet.tsx";
import { TableConfig } from "./table.tsx";
import { ImageConfig } from "./image.tsx";
import { IframeConfig } from "./iframeConfig.tsx";

export const DefaultPanelViewConfig = () => {
  const config = signalViewNodeAttrConfig("DEFAULT-VIEW-PANEL-CONFIG");
  config.setConfigEle(() => {
    return (
      <>
        <DefaultPanelSetting />
      </>
    );
  });
};

export const AttrViewConfigInit = () => {
  PixBXChartConfig();
  TableConfig();
  IframeConfig();
  ImageConfig();
};
