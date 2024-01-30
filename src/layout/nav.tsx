import { Tooltip, Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify-icon/react";
import { Link, Outlet } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AInput } from "../comp/AInput";
import { useDispatch, useSelector } from "react-redux";
import { IWls } from "../store/slice/widgetSlice";

import { updateShow } from "../store/slice/widgetSlice";

export const Nav = () => {
  const [showTools, setShowTools] = useState(false);
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setShowTools(
      location.pathname === "/panel" || location.pathname === "/panel/"
    );
  }, [location]);

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

  const widgetState = useSelector((state: { widgetSlice: IWls }) => {
    console.log(state, "00000state");
    return state.widgetSlice;
  });
  const onHandleWidVis = () => {
    console.log(!widgetState.show, "!widgetState.show");
    dispatch(updateShow(!widgetState.show));
  };

  return (
    <>
      <div className="flex justify-between m-1 border-zinc-200 border-b-[1px] pb-1 h-[44px]">
        <div className="flex items-center">
          <Link to={"/menu"}>
            <Button isIconOnly variant="light" aria-label="locale" size="sm">
              <Icon icon="ic:round-home" width={"16px"} height={"16px"} />
            </Button>
          </Link>
          <>
            {showTools && (
              <>
                <Button
                  size="sm"
                  className="ml-6"
                  isIconOnly
                  variant="light"
                  aria-label="locale"
                  style={{
                    background: widgetState.show ? "#338ef7" : "",
                  }}
                  onClick={onHandleWidVis}
                >
                  <Icon icon="mdi:widget-tree" width={"16px"} height={"16px"} />
                </Button>

                <Button
                  size="sm"
                  className="ml-6"
                  isIconOnly
                  variant="light"
                  aria-label="locale"
                >
                  <Icon
                    icon="icons8:left-round"
                    width={"16px"}
                    height={"16px"}
                  />
                </Button>
                <Button
                  size="sm"
                  className="ml-2"
                  isIconOnly
                  variant="light"
                  aria-label="locale"
                >
                  <Icon
                    icon="icons8:right-round"
                    width={"16px"}
                    height={"16px"}
                  />
                </Button>
                <Button
                  size="sm"
                  className="ml-6"
                  isIconOnly
                  variant="light"
                  aria-label="locale"
                >
                  <Icon icon="uil:save" width={"16px"} height={"16px"} />
                </Button>

                <div className="ml-[60px] flex items-center">
                  <AInput
                    placeholder="工作空间"
                    className="w-[240px] rounded-md"
                    size="xs"
                    radius="md"
                    startContent={
                      <Icon
                        icon="fluent-mdl2:pen-workspace"
                        className="mr-2 ml-2"
                      />
                    }
                  />
                </div>
              </>
            )}
          </>
        </div>
        <div className="flex items-center">
          <Tooltip color={"primary"} content={"预览"} className="capitalize">
            <Button
              className="mr-2"
              size="sm"
              variant="light"
              aria-label="locale"
            >
              预览
            </Button>
          </Tooltip>
          <Tooltip color={"primary"} content={"国际化"} className="capitalize">
            <Button
              isIconOnly
              className="mr-2"
              variant="light"
              size="sm"
              aria-label="locale"
            >
              <Icon
                icon="fluent-mdl2:locale-language"
                width={"16px"}
                height={"16px"}
              />
            </Button>
          </Tooltip>
          <Tooltip color={"primary"} content={"主题"} className="capitalize">
            <Button
              className="mr-2"
              isIconOnly
              variant="light"
              size="sm"
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
