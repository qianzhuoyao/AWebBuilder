import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import beautify_js from "js-beautify";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";
import { INs, updateInstance } from "../../../store/slice/nodeSlice.ts";
import { Button, Code, Select, SelectItem, Tooltip } from "@nextui-org/react";
import { PhQuestion } from "../../attrConfig/view/panelSet.tsx";
import {
  parseFnContent,
  runViewFnString,
} from "../../../comp/setDefaultChartOption.ts";
import { useAutoHeight } from "../../../comp/useAutoHeight.tsx";
import { dispatchViewUpdate } from "../../../emit/emitChart.ts";
import { insertConfig } from "../../../node/viewConfigSubscribe.ts";
import { CHART_OPTIONS } from "../../attrConfig/view/CHART_OPTIONS.ts";
import { useTakeNodeData } from "../../../comp/useTakeNodeData.tsx";

export const PixBXChartConfigCode = () => {
  const codeContainerHeight = useAutoHeight();
  const mirrorRef = useRef<ReactCodeMirrorRef>(null);
  const dispatch = useDispatch();
  const [parseError, setParseError] = useState("");
  const { theme } = useTheme();
  const [curCode, setCurCode] = useState("");
  const NodesState = useTakeNodeData()
  const { targets } = NodesState;

  //只允许一项

  const updateChartClassify = useCallback(
    (classify: keyof typeof CHART_OPTIONS) => {
      const target = targets[0];
      const chartInfo = CHART_OPTIONS[classify];
      setCurCode(chartInfo);
      dispatch(
        updateInstance({
          type: NodesState.list[target].instance.type,
          id: NodesState.list[target].id,
          option: {
            chartClass: classify,
            chart: chartInfo,
          },
        })
      );
      dispatchViewUpdate(NodesState.list[target].id, chartInfo);
    },
    [NodesState, dispatch, targets]
  );

  const codeString = useMemo(() => {
    if (targets.length) {
      const target = targets[0];
      return beautify_js(
        runViewFnString(NodesState.list[target]?.instance?.option?.chart || ""),
        { indent_size: 2 }
      );
    } else {
      return runViewFnString("");
    }
  }, [NodesState.list, targets]);

  const onChange = useCallback(
    (value: string) => {
      const parseValue = parseFnContent(value);

      setCurCode(parseValue);
      try {
        if (targets.length) {
          new Function(value)({});
          setParseError("");
          console.log(parseValue, "parseValues");
          insertConfig(NodesState.targets[0], {
            chart: parseValue,
          });
        }
      } catch (e) {
        setParseError((e as { message: string }).message);

        throw new Error((e as { message: string }).message);
      }
    },
    [NodesState.targets, targets.length]
  );

  useEffect(() => {
    if (targets.length) {
      const target = targets[0];
      setCurCode(NodesState.list[target]?.instance?.option?.chart || "");
    }
  }, [NodesState.list, targets]);

  const onUpdate = useCallback(() => {
    if (!parseError) {
      if (targets.length) {
        const target = targets[0];
        dispatch(
          updateInstance({
            type: NodesState.list[target].instance.type,
            id: NodesState.list[target].id,
            option: {
              chartClass: NodesState.list[target].instance.option?.chartClass,
              chart: curCode,
            },
          })
        );
        dispatchViewUpdate(NodesState.list[target].id, curCode);
      }
    }
  }, [NodesState, curCode, dispatch, parseError, targets]);

  return (
    <>
      <div className={"h-[20px] text-[10px]"}>
        <Tooltip
          content={
            <div className={"w-[200px]"}>
              配置中,可使用<Code>params</Code>
              来指代当前节点在逻辑操作中接收到的数据。
            </div>
          }
        >
          <div className={"w-[fit-content]"}>
            <PhQuestion></PhQuestion>
          </div>
        </Tooltip>
      </div>
      {parseError && (
        <div className={"h-[40px] text-[10px] text-red-500 overflow-y-scroll"}>
          {parseError}
        </div>
      )}
      <div className={"mb-1"}>
        <Select
          labelPlacement="outside"
          aria-label={"clas"}
          selectedKeys={[
            NodesState.list[NodesState.targets[0]]?.instance?.option
              ?.chartClass || "",
          ]}
          placeholder="图表类型"
          size={"sm"}
          className="max-w-xs"
          onChange={(e) => {
            if (e.target.value) {
              updateChartClassify(e.target.value as keyof typeof CHART_OPTIONS);
            }
          }}
        >
          {Object.keys(CHART_OPTIONS).map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </Select>
      </div>
      <CodeMirror
        ref={mirrorRef}
        value={codeString}
        height={codeContainerHeight - 180 - (parseError ? 40 : 0) + "px"}
        lang={"JavaScript"}
        theme={theme === "dark" ? "dark" : "light"}
        extensions={[javascript(), EditorView.lineWrapping]}
        basicSetup={{
          lintKeymap: false,
        }}
        onChange={onChange}
      />

      <div className={"h-[40px] mt-2"}>
        <Button
          size={"sm"}
          isDisabled={!!parseError}
          onClick={() => {
            onUpdate();
          }}
        >
          同步
        </Button>
      </div>
    </>
  );
};
