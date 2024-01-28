import { Tools } from "./tool";
import { Scene } from "./Scene";
import { AttrSetting } from "./AttrSetting";
export const Panel = () => {
  return (
    <div className="flex h-[calc(100vh_-_40px_-_0.5rem)]">
      <Tools></Tools>
      <Scene></Scene>
      <AttrSetting></AttrSetting>
    </div>
  );
};
