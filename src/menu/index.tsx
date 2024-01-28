import { MenuContent } from "./content";

import { Spacer } from "@nextui-org/react";
export const Menu = () => {
  return (
    <div className="flex">
      <Spacer x={4} />
      <MenuContent />
    </div>
  );
};
