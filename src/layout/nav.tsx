import { Tooltip, Button, Card, CardBody } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify-icon/react";
import { Link, Outlet } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AInput } from "../comp/AInput";
export const Nav = () => {
  const [showTools, setShowTools] = useState(false);

  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(location, "location");
    if (
      location.pathname === "/" ||
      location.pathname === "/menu/" ||
      location.pathname === "/menu"
    ) {
      navigate("/menu/proj");
    }
    setShowTools(
      location.pathname === "/panel" || location.pathname === "/panel/"
    );
  }, []);

  const onChangeTheme = useCallback(() => {
    console.log(theme, "theme");
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme]);

  return (
    <>
      <div className="flex justify-between m-1">
        <div className="flex items-center">
          <Link to={"/menu"}>
            <Button isIconOnly variant="light" aria-label="locale">
              <Icon icon="ic:round-home" width={"16px"} height={"16px"} />
            </Button>
          </Link>
          <Button
            className="ml-6"
            isIconOnly
            variant="light"
            aria-label="locale"
          >
            <Icon icon="mdi:widget-tree" width={"16px"} height={"16px"} />
          </Button>
          <Button
            className="ml-2"
            isIconOnly
            variant="light"
            aria-label="locale"
          >
            <Icon icon="mingcute:layer-fill" width={"16px"} height={"16px"} />
          </Button>
          <Button
            className="ml-2"
            isIconOnly
            variant="light"
            aria-label="locale"
          >
            <Icon icon="tabler:list-details" width={"16px"} height={"16px"} />
          </Button>

          <Button
            className="ml-6"
            isIconOnly
            variant="light"
            aria-label="locale"
          >
            <Icon icon="icons8:left-round" width={"16px"} height={"16px"} />
          </Button>
          <Button
            className="ml-2"
            isIconOnly
            variant="light"
            aria-label="locale"
          >
            <Icon icon="icons8:right-round" width={"16px"} height={"16px"} />
          </Button>
          <Button
            className="ml-6"
            isIconOnly
            variant="light"
            aria-label="locale"
          >
            <Icon icon="uil:save" width={"16px"} height={"16px"} />
          </Button>

          <div className="ml-6 flex items-center">
            <Icon icon="fluent-mdl2:pen-workspace" className="mr-2" />
            <AInput
              placeholder="工作空间"
              className="w-[120px] rounded-md"
              size="xs"
              radius="md"
            />
          </div>
        </div>
        <div>
          <Tooltip color={"primary"} content={"国际化"} className="capitalize">
            <Button isIconOnly variant="light" aria-label="locale">
              <Icon
                icon="fluent-mdl2:locale-language"
                width={"16px"}
                height={"16px"}
              />
            </Button>
          </Tooltip>
          <Tooltip color={"primary"} content={"主题"} className="capitalize">
            <Button
              isIconOnly
              variant="light"
              aria-label="theme"
              onClick={onChangeTheme}
            >
              <Icon
                icon="mdi:theme-light-dark"
                width={"16px"}
                height={"16px"}
              />
            </Button>
          </Tooltip>
        </div>
      </div>

      <Outlet />
    </>
  );
};
