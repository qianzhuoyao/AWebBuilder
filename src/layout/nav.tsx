import { Tooltip, Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify-icon/react";
import { Link, Outlet } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
export const Nav = () => {
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
  }, []);

  const onChangeTheme = useCallback(() => {
    console.log(theme, "theme");
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme]);

  return (
    <>
      <div className="flex justify-between m-1">
        <Link to={"/menu"}>
          <Button
            isIconOnly
            color="primary"
            variant="light"
            aria-label="locale"
          >
            <Icon icon="ic:round-home" />
          </Button>
        </Link>
        <div>
          <Tooltip color={"primary"} content={"国际化"} className="capitalize">
            <Button
              isIconOnly
              color="primary"
              variant="light"
              aria-label="locale"
            >
              <Icon icon="fluent-mdl2:locale-language" />
            </Button>
          </Tooltip>
          <Tooltip color={"primary"} content={"主题"} className="capitalize">
            <Button
              isIconOnly
              color="primary"
              variant="light"
              aria-label="theme"
              onClick={onChangeTheme}
            >
              <Icon icon="mdi:theme-light-dark" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <Outlet />
    </>
  );
};
