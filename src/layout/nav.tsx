import { Tooltip, Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
// import { Icon } from '@iconify-icon/react';
import { Link, Outlet, useSearchParams } from "react-router-dom";
import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AInput } from "../comp/AInput";
import { useDispatch, useSelector } from "react-redux";
import { IWls } from "../store/slice/widgetSlice";
import { updateShow } from "../store/slice/widgetSlice";
import type { SVGProps } from "react";
import { IPs, updateWorkSpaceName } from "../store/slice/panelSlice.ts";
import { toast } from "react-toastify";
import { INs, setList } from "../store/slice/nodeSlice.ts";
import { getWDGraph } from "../DirGraph/weightedDirectedGraph.ts";
import { logicNodesConfigToJSON } from "../panel/logicPanelEventSubscribe.ts";
import { genLogicConfigMapToJSON } from "../Logic/nodes/logicConfigMap.ts";
import { toSaveJSON, toSetLocalstorage } from "../struct/toJSON.ts";

import { IARs, RECORD_VIEW_NODE } from "../store/slice/viewNodesRecordSlice.ts";
import { DEMO_CAROUSEL_LOCALSTORAGE_PREVIEW } from "../contant/index.ts";

export function FluentMdl2PenWorkspace(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={"mr-2 ml-2"}
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 2048 2048"
      {...props}
    >
      <path
        fill="currentColor"
        d="M1747 290q14 8 23 23t9 32q0 8-2 15t-5 14l-707 1415q-9 19-28 28l-173 87q-32 16-69 16h-9q-4 0-10-1l-47 94q-8 16-23 25t-34 10q-26 0-45-19t-19-45q0-12 7-30t16-37t20-37t15-28q-26-40-26-87v-165q0-16 7-29l576-1152l-65-32l-237 474q-8 16-23 25t-34 10q-26 0-45-19t-19-45q0-13 7-29l239-478q16-32 43-50t63-19q35 0 66 17t62 32l71-142q8-17 23-26t34-9q13 0 22 4q12-24 23-47t26-43t36-30t53-12q32 0 61 15l94 47q32 16 50 42t19 64q0 34-15 63t-30 59m-202-101l87 43l29-58l-87-43zm84 185l-192-96l-669 1337v150q0 11 8 19t19 8q4 0 16-5t29-13t35-17t36-19t30-16t19-10zm163 394q53 0 99 20t82 55t55 81t20 100q0 53-20 99t-55 82t-81 55t-100 20h-288l64-128h224q27 0 50-10t40-27t28-41t10-50q0-27-10-50t-27-40t-41-28t-50-10q-26 0-45-19t-19-45q0-26 19-45t45-19M128 1600q0 66 25 124t68 102t102 69t125 25h44q-5 15-8 31t-4 33q0 17 3 33t9 31h-44q-93 0-174-35t-142-96t-96-142t-36-175q0-93 35-174t96-142t142-96t175-36h224l-64 128H448q-66 0-124 25t-102 69t-69 102t-25 124"
      ></path>
    </svg>
  );
}

export function IcOutlineSave(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7zm2 16H5V5h11.17L19 7.83zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3M6 6h9v4H6z"
      ></path>
    </svg>
  );
}

export function SolarUndoRightRoundSquareOutline(
  props: SVGProps<SVGSVGElement>
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M15.759 6.873a.75.75 0 1 0-1.018 1.102l.84.776h-5.62a4.212 4.212 0 1 0 0 8.423H14.5a.75.75 0 0 0 0-1.5H9.962a2.712 2.712 0 1 1 0-5.423h5.62l-.84.776a.75.75 0 1 0 1.017 1.102l2.25-2.077a.75.75 0 0 0 0-1.102z"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M11.943 1.25c-2.309 0-4.118 0-5.53.19c-1.444.194-2.584.6-3.479 1.494c-.895.895-1.3 2.035-1.494 3.48c-.19 1.411-.19 3.22-.19 5.529v.114c0 2.309 0 4.118.19 5.53c.194 1.444.6 2.584 1.494 3.479c.895.895 2.035 1.3 3.48 1.494c1.411.19 3.22.19 5.529.19h.114c2.309 0 4.118 0 5.53-.19c1.444-.194 2.584-.6 3.479-1.494c.895-.895 1.3-2.035 1.494-3.48c.19-1.411.19-3.22.19-5.529v-.114c0-2.309 0-4.118-.19-5.53c-.194-1.444-.6-2.584-1.494-3.479c-.895-.895-2.035-1.3-3.48-1.494c-1.411-.19-3.22-.19-5.529-.19zM3.995 3.995c.57-.57 1.34-.897 2.619-1.069c1.3-.174 3.008-.176 5.386-.176s4.086.002 5.386.176c1.279.172 2.05.5 2.62 1.069c.569.57.896 1.34 1.068 2.619c.174 1.3.176 3.008.176 5.386s-.002 4.086-.176 5.386c-.172 1.279-.5 2.05-1.069 2.62c-.57.569-1.34.896-2.619 1.068c-1.3.174-3.008.176-5.386.176s-4.086-.002-5.386-.176c-1.279-.172-2.05-.5-2.62-1.069c-.569-.57-.896-1.34-1.068-2.619c-.174-1.3-.176-3.008-.176-5.386s.002-4.086.176-5.386c.172-1.279.5-2.05 1.069-2.62"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export function SolarUndoLeftRoundSquareLinear(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.5 9.5h7.539a3.462 3.462 0 0 1 0 6.923H9.5M6.5 9.5l2.25-2.077M6.5 9.5l2.25 2.077"
        ></path>
        <path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z"></path>
      </g>
    </svg>
  );
}

export function MdiWidgetTree(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M14 6h8v16h-8zM2 4h20V2H2zm0 4h10V6H2zm7 14h3V10H9zm-7 0h5V10H2z"
      ></path>
    </svg>
  );
}

export function MdiThemeLightDark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M7.5 2c-1.79 1.15-3 3.18-3 5.5s1.21 4.35 3.03 5.5C4.46 13 2 10.54 2 7.5A5.5 5.5 0 0 1 7.5 2m11.57 1.5l1.43 1.43L4.93 20.5L3.5 19.07zm-6.18 2.43L11.41 5L9.97 6l.42-1.7L9 3.24l1.75-.12l.58-1.65L12 3.1l1.73.03l-1.35 1.13zm-3.3 3.61l-1.16-.73l-1.12.78l.34-1.32l-1.09-.83l1.36-.09l.45-1.29l.51 1.27l1.36.03l-1.05.87zM19 13.5a5.5 5.5 0 0 1-5.5 5.5c-1.22 0-2.35-.4-3.26-1.07l7.69-7.69c.67.91 1.07 2.04 1.07 3.26m-4.4 6.58l2.77-1.15l-.24 3.35zm4.33-2.7l1.15-2.77l2.2 2.54zm1.15-4.96l-1.14-2.78l3.34.24zM9.63 18.93l2.77 1.15l-2.53 2.19z"
      ></path>
    </svg>
  );
}

export function FluentMdl2LocaleLanguage(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 2048 2048"
      {...props}
    >
      <path
        fill="currentColor"
        d="m601 1152l295 886v10H765l-86-256H345l-86 256H128v-10l295-886zm36 512l-125-374l-125 374zM893 512q3 65 3 128v64q0 32-2 64H768v128H523l10 64q5 32 14 64H418q-8-32-12-64t-9-64H188q20 36 46 68t57 60h-35l-45 90q-101-91-156-214T0 640q0-88 23-170t64-153t100-129T317 88t153-65T640 0q88 0 170 23t153 64t129 100t100 130t65 153t23 170q0 32-3 64t-10 64h-124q17-65 17-128t-17-128zM640 120q-19 0-34 16t-28 41t-22 56t-15 60t-11 54t-6 37h231q-2-11-6-35t-10-54t-16-60t-22-56t-28-42t-33-17M387 768q-3-64-3-128q0-63 3-128H137q-17 65-17 128t17 128zm11-384q6-58 18-116t34-112q-83 33-150 91T188 384zm369 384q3-64 3-128q0-63-3-128H513q-3 65-3 128q0 64 3 128zm58-613q23 54 36 112t20 117h211q-45-78-113-137t-154-92m566 734q0-30-1-61t-8-60q69 0 137 6q6 1 12 3t7 10q0 5-3 12t-5 12q-2 6-3 16t-2 21t-1 22t0 17v13h296q42 0 83-1t84-2q7 0 13 3q3 5 3 10q-1 17-2 35t-1 36v58q0 36 1 72t2 73v7q0 4-3 6q-8 2-13 2h-25q-20 0-41 1q-19 0-34-1t-17-3q-2-8-2-24t-1-36q0-33 1-68t1-52h-802v39q0 15 1 31t0 34q0 29-1 52t-3 26q-8 2-13 2H949q-11 0-13-3t-2-13q1-40 1-79t0-79v-58q0-29-1-58q0-5 2-11q8-2 13-2q42 1 83 2t84 1h275zm639 553q2 8 2 13v96q0 4-2 12q-8 2-13 2q-40-1-79-2t-79-1h-321v33q0 52 1 104t3 104v4q0 24-9 48t-29 38q-14 10-39 15t-55 8t-56 3t-44 1h-19q-13 0-18-6q-3-3-7-16t-6-18q-7-26-16-48t-24-46q34 4 68 5t68 2q24 0 36-7t13-34v-190h-319q-40 0-80 1t-80 2q-8 0-12-3q-2-6-2-11v-103q0-4 3-7q6-2 11-2l80 2q40 1 80 1h319q-2-26-2-52t-6-53q20 2 39 3t40 4h3q1 0 4 1q35-25 67-53t64-57h-308q-42 0-83 1t-84 2q-8 0-12-3q-2-6-2-11v-95q0-4 2-12q8-2 12-2q42 1 83 2t84 1h373q16 0 30-4t25-5q8 0 23 12t30 28t26 32t12 25q0 10-6 15t-15 10q-14 7-27 18t-25 21q-52 43-104 83t-110 78v11h321q40 0 79-1t79-2q7 0 13 3"
      ></path>
    </svg>
  );
}

export function IcBaselineHome(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z"></path>
    </svg>
  );
}

export const Nav = memo(() => {
  const [showTools, setShowTools] = useState(false);
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  useEffect(() => {
    setShowTools(
      location.pathname === "/panel" || location.pathname === "/panel/"
    );
  }, [location]);

  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname === "/menu/" ||
      location.pathname === "/menu"
    ) {
      navigate("/menu/proj");
    }
  }, [location, navigate]);

  const onChangeTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });

  const widgetState = useSelector((state: { widgetSlice: IWls }) => {
    return state.widgetSlice;
  });
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  const NodesRecordState = useSelector(
    (state: { viewNodesRecordSlice: { present: IARs } }) => {
      return state.viewNodesRecordSlice.present;
    }
  );

  const onHandleWidVis = useCallback(() => {
    dispatch(updateShow(!widgetState.show));
  }, [dispatch, widgetState.show]);

  const onHandleChangeWorkSpaceName = useCallback(
    (name: string) => {
      if (name === "") {
        toast.error("命名空间不可以为空,最少保留一个字符");
      } else {
        dispatch(updateWorkSpaceName(name));
      }
    },
    [dispatch]
  );

  const onSave = useCallback(() => {
    console.log(search.get('id'), 'dwdwwdffff')
    toSaveJSON(PanelState, NodesState, search.get('id') || '');
  }, [NodesState, PanelState]);

  const redo = useCallback(() => {
    dispatch({
      type: "viewRedo",
    });
    setTimeout(() => {
      if (NodesRecordState.recordViewType === RECORD_VIEW_NODE) {
        dispatch(setList(NodesRecordState.recordViewInfo));
      }
    }, 0);
  }, [
    NodesRecordState.recordViewInfo,
    NodesRecordState.recordViewType,
    dispatch,
  ]);
  const undo = useCallback(() => {
    dispatch({
      type: "viewUndo",
    });
    setTimeout(() => {
      if (NodesRecordState.recordViewType === RECORD_VIEW_NODE) {
        dispatch(setList(NodesRecordState.recordViewInfo));
      }
    }, 0);
  }, [
    NodesRecordState.recordViewInfo,
    NodesRecordState.recordViewType,
    dispatch,
  ]);
  const onPreView = useCallback(() => {
    toSetLocalstorage(
      PanelState.workSpaceName,
      DEMO_CAROUSEL_LOCALSTORAGE_PREVIEW,
      JSON.stringify(NodesState),
      JSON.stringify(PanelState),
      JSON.stringify({
        C: genLogicConfigMapToJSON(),
        G: getWDGraph().toJSON(),
        N: logicNodesConfigToJSON(),
      })
    );
    window.open(
      window.location.origin +
      "/demo?work=" +
      JSON.stringify({
        indexList: [PanelState.workSpaceName],
      })
    );
  }, [NodesState, PanelState]);

  return (
    <>
      <div className="flex justify-between m-1 border-zinc-200 border-b-[1px] h-[44px]">
        <div className="flex items-center">
          <Link to={"/menu"}>
            <Button isIconOnly variant="light" aria-label="locale" size="sm">
              <IcBaselineHome></IcBaselineHome>
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
                  {/*<Icon icon="mdi:widget-tree" width={'16px'} height={'16px'} />*/}
                  <MdiWidgetTree></MdiWidgetTree>
                </Button>

                <Button
                  size="sm"
                  className="ml-6"
                  isIconOnly
                  variant="light"
                  aria-label="locale"
                  onClick={undo}
                >
                  <SolarUndoLeftRoundSquareLinear></SolarUndoLeftRoundSquareLinear>
                  {/*<Icon*/}
                  {/*  icon="icons8:left-round"*/}
                  {/*  width={'16px'}*/}
                  {/*  height={'16px'}*/}
                  {/*/>*/}
                </Button>
                <Button
                  size="sm"
                  className="ml-2"
                  isIconOnly
                  variant="light"
                  aria-label="locale"
                  onClick={redo}
                >
                  <SolarUndoRightRoundSquareOutline></SolarUndoRightRoundSquareOutline>
                  {/*<Icon*/}
                  {/*  icon="icons8:right-round"*/}
                  {/*  width={'16px'}*/}
                  {/*  height={'16px'}*/}
                  {/*/>*/}
                </Button>
                <Button
                  size="sm"
                  className="ml-6"
                  isIconOnly
                  variant="light"
                  aria-label="locale"
                  onClick={onSave}
                >
                  {/*<Icon icon="uil:save" width={'16px'} height={'16px'} />*/}
                  <IcOutlineSave></IcOutlineSave>
                </Button>

                <div className="ml-[60px] flex items-center">
                  <AInput
                    placeholder="工作空间"
                    className="w-[240px] rounded-md"
                    size="xs"
                    radius="md"
                    value={PanelState.workSpaceName}
                    onChange={(e) => {
                      onHandleChangeWorkSpaceName(e.target.value);
                    }}
                    startContent={
                      // <Icon
                      //   icon="fluent-mdl2:pen-workspace"
                      //   className="mr-2 ml-2"
                      // />
                      <FluentMdl2PenWorkspace></FluentMdl2PenWorkspace>
                    }
                  />
                </div>
              </>
            )}
          </>
        </div>
        <div className="flex items-center">
          {showTools ? (
            <Tooltip color={"primary"} content={"预览"} className="capitalize">
              <Button
                className="mr-2"
                size="sm"
                variant="light"
                aria-label="locale"
                onClick={() => {
                  onPreView();
                }}
              >
                预览
              </Button>
            </Tooltip>
          ) : (
            <></>
          )}
          <Tooltip color={"primary"} content={"国际化"} className="capitalize">
            <Button
              isIconOnly
              className="mr-2"
              variant="light"
              size="sm"
              aria-label="locale"
            >
              <FluentMdl2LocaleLanguage></FluentMdl2LocaleLanguage>
              {/*<Icon*/}
              {/*  icon="fluent-mdl2:locale-language"*/}
              {/*  width={'16px'}*/}
              {/*  height={'16px'}*/}
              {/*/>*/}
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
              <MdiThemeLightDark></MdiThemeLightDark>
              {/*<Icon*/}
              {/*  icon="mdi:theme-light-dark"*/}
              {/*  width={'16px'}*/}
              {/*  height={'16px'}*/}
              {/*/>*/}
            </Button>
          </Tooltip>
        </div>
      </div>

      <Outlet />
    </>
  );
});
