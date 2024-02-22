import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import beautify_js from 'js-beautify';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useDispatch, useSelector } from 'react-redux';
import { INs, updateInstance } from '../../../store/slice/nodeSlice.ts';
import { MAIN_CONTAINER } from '../../../contant';
import { Button } from '@nextui-org/react';

export const PixBXChartConfigCode = () => {
  const mirrorRef = useRef<ReactCodeMirrorRef>(null);
  const dispatch = useDispatch();
  const [codeContainerHeight, setCodeContainerHeight] = useState(0);
  const [parseError, setParseError] = useState('');
  const { theme } = useTheme();
  const [formatter, setFormatter] = useState(false);
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  const { targets } = NodesState;

  //只允许一项

  const codeString = useMemo(() => {
    if (targets.length) {
      const target = targets[0];
      return (formatter ? ' ' : '') + beautify_js(JSON.stringify(NodesState.list[target].instance.option), { indent_size: 2 });
    } else {
      return '{}';
    }
  }, [NodesState.list, targets, formatter]);

  const onChange = useCallback((value: string) => {
    try {
      if (targets.length) {
        const target = targets[0];
        setParseError('');
        console.log(JSON.parse(value), 'JSON.parse(value)-0');
        dispatch(updateInstance({
          type: NodesState.list[target].instance.type,
          id: NodesState.list[target].id,
          option: JSON.parse(value),
        }));
      }

    } catch (e) {
      setParseError(e.message);
      console.log(e, 'JSON.parse(value)-1');
    }
  }, [NodesState.list, targets]);


  useEffect(() => {
    const MAIN = document.getElementById(MAIN_CONTAINER);
    if (MAIN) {
      setCodeContainerHeight(MAIN.getBoundingClientRect().height);
    }
  }, []);


  return <>
    {parseError && <div className={'h-[40px] text-[10px] text-red-500 overflow-y-scroll'}>
      {parseError}
    </div>}
    <CodeMirror
      ref={mirrorRef}
      value={codeString}
      height={codeContainerHeight - 120 - (parseError ? 40 : 0) + 'px'}
      lang={'json'}
      theme={theme === 'dark' ? 'dark' : 'light'}
      extensions={[json(), EditorView.lineWrapping]}
      basicSetup={{
        lintKeymap: false,
      }}
      onChange={onChange} />
    <div className={'h-[40px] mt-2'}>
      <Button size={'sm'} isDisabled={!!parseError} onClick={() => {
        setFormatter(!formatter);
      }}>
        格式化
      </Button>
    </div>
  </>;
};