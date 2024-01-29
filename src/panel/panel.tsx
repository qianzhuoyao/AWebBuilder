import { Tools } from "./tool";
import { Scene } from "./Scene";
import { AttrSetting } from "./AttrSetting";
export const Panel = () => {
  return (
    <div className="flex h-[calc(100vh_-_44.56px_-_0.5rem)] px-1 w-full overflow-hidden">
      <Tools></Tools>
      <Scene></Scene>
      <AttrSetting></AttrSetting>
    </div>
  );
};
