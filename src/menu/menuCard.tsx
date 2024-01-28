import {
  Card,
  CardHeader,
  Listbox,
  ListboxItem,
  Tabs,
  CardBody,
  Spacer,
  Divider,
  Tab,
} from "@nextui-org/react";
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

export const MenuCard = () => {
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
        {/* <Card className="w-[240px]">
          <CardHeader className="flex gap-3">项目</CardHeader>
          <Divider />
          <CardBody>
            <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
              <Listbox
                variant="flat"
                aria-label="Listbox menu with descriptions"
              >
                <ListboxItem key="proj" startContent={"icon1"}>
                  <Link to={"/menu/proj"}>我的项目</Link>
                </ListboxItem>

                <ListboxItem key="temp" startContent={"icon2"}>
                  <Link to={"/menu/temp"}>我的模板</Link>
                </ListboxItem>
              </Listbox>
            </div>
          </CardBody>
        </Card> */}
      </div>
    </div>
  );
};
