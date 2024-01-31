import { Card, Tabs, CardBody, Tab } from "@nextui-org/react";
import { memo } from "react";
import { Link, Outlet } from "react-router-dom";

const tabs = [
  {
    id: "proj",
    routeLink: "/menu/proj",
    label: "项目",
  },
  {
    id: "temp",
    routeLink: "/menu/temp",
    label: "模板",
  },
];

export const MenuCard = memo(() => {
  return (
    <div className="h-[calc(100vh_-_40px)]">
      <div>
        <Tabs aria-label="Dynamic tabs" items={tabs} className="ml-1">
          {(item) => (
            <Tab
              key={item.id}
              title={
                <>
                  <Link to={item.routeLink}>{item.label}</Link>
                </>
              }
            >
              <Card>
                <CardBody>
                  <Outlet />
                </CardBody>
              </Card>
            </Tab>
          )}
        </Tabs>
      </div>
    </div>
  );
});
