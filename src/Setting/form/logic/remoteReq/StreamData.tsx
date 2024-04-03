import { useEffect, useRef, useState } from "react";
import { subscribeViewCacheUpdate } from "../../../../panel/data.ts";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import beautify_js from "js-beautify";
import { useAutoHeight } from "../../../../comp/useAutoHeight.tsx";
import { useTheme } from "next-themes";
import { Tooltip } from "@nextui-org/react";
import { PhQuestion } from "../../../attrConfig/view/panelSet.tsx";

export const StreamData = () => {
  const mirrorRef = useRef<ReactCodeMirrorRef>(null);
  const [showData, setShowData] = useState({});
  const height = useAutoHeight();
  const { theme } = useTheme();
  useEffect(() => {
    const sSub = subscribeViewCacheUpdate(({ data }: any) => {
      setShowData(data);
    });
    return () => {
      sSub.unsubscribe();
    };
  }, []);
  return (
    <>
      <div className={"h-[20px] text-[10px]"}>
        <Tooltip
          content={
            <div className={"w-[200px]"}>
              当前展示为数据流下当前组件收入的值,会被打入params
            </div>
          }
        >
          <div className={"w-[fit-content]"}>
            <PhQuestion></PhQuestion>
          </div>
        </Tooltip>
      </div>
      <CodeMirror
        ref={mirrorRef}
        value={beautify_js(JSON.stringify(showData), { indent_size: 2 })}
        height={height - 100 + "px"}
        lang={"JavaScript"}
        theme={theme === "dark" ? "dark" : "light"}
        extensions={[javascript(), EditorView.lineWrapping]}
        basicSetup={{
          lintKeymap: false,
        }}
      />
    </>
  );
};
