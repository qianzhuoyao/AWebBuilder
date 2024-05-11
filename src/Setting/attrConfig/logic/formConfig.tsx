import { signalLogicNodeAttrConfig } from "../../signalNodeConfig.ts";
import { logic_Form_get } from "../../../store/slice/nodeSlice.ts";
import { Card, CardBody, Switch, Tab, Tabs, Tooltip } from "@nextui-org/react";
import { memo, useCallback, useRef, useState } from "react";
import { useTheme } from "next-themes";
import ReactJson from "react-json-view";
import beautify_js from "js-beautify";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { useAutoHeight } from "../../../comp/useAutoHeight.tsx";
import {
  genLogicConfigMap,
  IFormConfigInfo,
} from "../../../Logic/nodes/logicConfigMap.ts";
import { useSelector } from "react-redux";
import { ILs } from "../../../store/slice/logicSlice.ts";
import { PhQuestion } from "../view/panelSet.tsx";
import { useTakeLogicData } from "../../../comp/useTakeLogicData.tsx";

const CodeTip = memo(() => {
  const logicState = useTakeLogicData()
  const defaultValue = () =>
    genLogicConfigMap().configInfo.get(logicState.target[0])?.formConfigInfo
      ?.json;
  const height = useAutoHeight();

  const [code, setCode] = useState<
    object | Record<string, unknown> | undefined
  >(() => defaultValue());

  const { theme } = useTheme();

  const updateCode = useCallback(
    (newObj: object) => {
      if (newObj) {
        setCode(newObj);
        genLogicConfigMap().configInfo.set(logicState.target[0], {
          formConfigInfo: {
            ...genLogicConfigMap().configInfo.get(logicState.target[0])
              ?.formConfigInfo,
            json: newObj,
          },
        });
      }
    },
    [logicState.target]
  );

  return (
    <>
      <ReactJson
        style={{
          height: height - 180 + "px",
        }}
        name={"JSON"}
        theme={theme === "dark" ? "solarized" : "rjv-default"}
        src={code || {}}
        onEdit={(e) => {
          updateCode(e.updated_src);
        }}
        onSelect={() => {}}
        onAdd={(a) => {
          updateCode(a.updated_src);
        }}
        onDelete={(d) => {
          updateCode(d.updated_src);
        }}
      />
    </>
  );
});
const CodeEdit = memo(() => {
  const logicState = useTakeLogicData()
  const mirrorRef = useRef<ReactCodeMirrorRef>(null);
  const height = useAutoHeight();
  const defaultCode = genLogicConfigMap().configInfo.get(logicState.target[0])
    ?.formConfigInfo?.json;
  const [errorMsg, setErrorMsg] = useState("");

  const [code, setCode] = useState(defaultCode);
  const { theme } = useTheme();

  const updateEditCode = useCallback(
    (value: string) => {
      try {
        setErrorMsg("");
        const obj = JSON.parse(value);
        setCode(obj);
        genLogicConfigMap().configInfo.set(logicState.target[0], {
          formConfigInfo: {
            ...genLogicConfigMap().configInfo.get(logicState.target[0])
              ?.formConfigInfo,
            json: obj,
          },
        });
      } catch (e) {
        setErrorMsg((e as { message: string }).message);
      }
    },
    [logicState.target]
  );
  return (
    <>
      {errorMsg ? <small className={"text-red-600"}>{errorMsg}</small> : <></>}
      <CodeMirror
        ref={mirrorRef}
        value={beautify_js(JSON.stringify(code), { indent_size: 2 })}
        height={height - 180 + "px"}
        lang={"json"}
        theme={theme === "dark" ? "dark" : "light"}
        extensions={[json(), EditorView.lineWrapping]}
        basicSetup={{
          lintKeymap: false,
        }}
        onChange={(e) => {
          updateEditCode(e);
        }}
      />
    </>
  );
});
const FormMerge = memo(() => {
  const logicState = useTakeLogicData()
  const defaultCheck = genLogicConfigMap().configInfo.get(logicState.target[0])
    ?.formConfigInfo?.mergePre;
  const [check, setCheck] = useState(defaultCheck);

  const updateCheck = useCallback(
    (value: boolean) => {
      setCheck(value);
      genLogicConfigMap().configInfo.set(logicState.target[0], {
        formConfigInfo: {
          ...(genLogicConfigMap().configInfo.get(logicState.target[0])
            ?.formConfigInfo as IFormConfigInfo<object>),
          mergePre: value,
        },
      });
    },
    [logicState.target]
  );
  return (
    <>
      <div className={"flex items-center justify-between mb-1"}>
        <small className={"flex items-center"}>
          <Tooltip
            content={
              <div className={"w-[200px]"}>
                当合并选中时,会合并管道内数据流内的打至此的数据并覆盖相同属性值
              </div>
            }
          >
            <div className={"w-[fit-content]"}>
              <PhQuestion></PhQuestion>
            </div>
          </Tooltip>
          合并:
        </small>
        <Switch
          size={"sm"}
          isSelected={!!check}
          onValueChange={(check) => {
            updateCheck(check);
          }}
        ></Switch>
      </div>
    </>
  );
});

const FormContentConfig = () => {
  return (
    <>
      <Tabs
        aria-label="FormContentConfigA"
        classNames={{
          panel: "p-1",
          base: "px-1",
        }}
      >
        <Tab title={"codeTip"} key={"codeTip"}>
          <Card>
            <CardBody>
              <FormMerge></FormMerge>
              <CodeTip />
            </CardBody>
          </Card>
        </Tab>
        <Tab title={"codeEdit"} key={"codeEdit"}>
          <Card>
            <CardBody>
              <FormMerge></FormMerge>
              <CodeEdit />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </>
  );
};

export const FormConfig = () => {
  const config = signalLogicNodeAttrConfig(logic_Form_get);
  config.setConfigEle((nodeInfo) => {
    if (nodeInfo.target.length > 0) {
      return (
        <>
          <div className="flex w-full flex-col px-1">
            <Tabs
              aria-label="Dynamic FormConfigtabs"
              classNames={{
                panel: "p-1",
                base: "px-1",
              }}
            >
              <Tab title={"JSON设置"} key={nodeInfo.target[0]}>
                <Card>
                  <CardBody>
                    <FormContentConfig />
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </>
      );
    }
  });
};
