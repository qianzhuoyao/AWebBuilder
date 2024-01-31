import { memo } from "react";
import { MenuContent } from "./content";

import { Spacer } from "@nextui-org/react";
export const Menu = memo(() => {
  return (
    <div className="flex">
      <Spacer x={4} />
      <MenuContent />
    </div>
  );
});
