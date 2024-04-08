import { Card, CardBody } from "@nextui-org/react";
import { memo } from "react";
import { Outlet } from "react-router-dom";

export const MenuCard = memo(() => {
  return (
    <div className="h-[calc(100vh_-_40px)]">
      <div>
        <Card>
          <CardBody>
            <Outlet />
          </CardBody>
        </Card>
      </div>
    </div>
  );
});
