import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import beautify_js from 'js-beautify';
import { arrayToGenObj } from '../../../comp/computeTools.ts';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useSelector } from 'react-redux';
import { INs } from '../../../store/slice/nodeSlice.ts';
import { MAIN_CONTAINER } from '../../../contant';

export const PixBXChartConfigCode = () => {
  const mirrorRef = useRef<ReactCodeMirrorRef>(null);

  const [codeContainerHeight, setCodeContainerHeight] = useState(0);

  const { theme } = useTheme();
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  const { targets } = NodesState;

  //只允许一项
  const code = useMemo(() => {
    if (targets.length) {
      const target = targets[0];
      return NodesState.list[target].instance.option;
    } else {
      return {};
    }
  }, [targets]);

  const onChange = useCallback(() => {
  }, []);

  useEffect(() => {
    const MAIN = document.getElementById(MAIN_CONTAINER);
    if (MAIN) {
      setCodeContainerHeight(MAIN.getBoundingClientRect().height);
    }
  }, []);

  return <>
    <CodeMirror
      ref={mirrorRef}
      value={beautify_js(JSON.stringify(code), { indent_size: 2 })}
      height={codeContainerHeight-80 + 'px'}
      lang={'json'}
      theme={theme === 'dark' ? 'dark' : 'light'}
      extensions={[json(), EditorView.lineWrapping]}

      basicSetup={{
        lintKeymap: false,

      }}
      onChange={onChange} />
  </>;
};