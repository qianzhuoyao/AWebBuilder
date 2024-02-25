import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import beautify_js from 'js-beautify';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useDispatch, useSelector } from 'react-redux';
import { INs, updateInstance } from '../../../store/slice/nodeSlice.ts';
import { MAIN_CONTAINER } from '../../../contant';
import { Button, Code, Tooltip } from '@nextui-org/react';
import { PhQuestion } from '../../attrConfig/view/panelSet.tsx';
import { parseFnContent, runViewFnString } from '../../../comp/setDefaultChartOption.ts';
import { useAutoHeight } from '../../../comp/useAutoHeight.tsx';

export const defaultBuilderFn = `
return {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
    },
  ],
}
`;

export const PixBXChartConfigCode = () => {
  const codeContainerHeight = useAutoHeight();
  const mirrorRef = useRef<ReactCodeMirrorRef>(null);
  const dispatch = useDispatch();
  const [parseError, setParseError] = useState('');
  const { theme } = useTheme();
  const [curCode, setCurCode] = useState('');
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  const { targets } = NodesState;

  //只允许一项

  const codeString = useMemo(() => {
    if (targets.length) {
      const target = targets[0];
      return beautify_js(runViewFnString(NodesState.list[target]?.instance?.option || ''), { indent_size: 2 });
    } else {
      return runViewFnString('');
    }
  }, [NodesState.list, targets]);

  const onChange = useCallback((value: string) => {
    const parseValue = parseFnContent(value);

    setCurCode(parseValue);
    try {
      console.log(parseValue, 'JSON.parse(value)-0');
      if (targets.length) {
        new Function(value)({});
        setParseError('');
      }

    } catch (e) {
      setParseError(e.message);
      console.log(e, 'JSON.parse(value)-1');
      throw new Error(e.message);

    }
  }, [targets]);


  useEffect(() => {
    if (targets.length) {
      const target = targets[0];
      setCurCode(NodesState.list[target]?.instance?.option || '');
    }

  }, [NodesState.list, targets]);


  const onUpdate = useCallback(() => {
    if (!parseError) {
      if (targets.length) {
        const target = targets[0];
        dispatch(updateInstance({
          type: NodesState.list[target].instance.type,
          id: NodesState.list[target].id,
          option: curCode,
        }));
      }

    }
  }, [NodesState.list, curCode, parseError, targets]);

  return <>
    <div className={'h-[20px] text-[10px]'}>
      <Tooltip content={<div className={'w-[200px]'}>配置中,可使用<Code>params</Code>来指代当前节点在逻辑操作中接收到的数据。
      </div>}>
        <div className={'w-[fit-content]'}><PhQuestion></PhQuestion></div>
      </Tooltip>
    </div>
    {parseError && <div className={'h-[40px] text-[10px] text-red-500 overflow-y-scroll'}>
      {parseError}
    </div>}
    <CodeMirror
      ref={mirrorRef}
      value={codeString}
      height={codeContainerHeight - 180 - (parseError ? 40 : 0) + 'px'}
      lang={'JavaScript'}
      theme={theme === 'dark' ? 'dark' : 'light'}
      extensions={[javascript(), EditorView.lineWrapping]}
      basicSetup={{
        lintKeymap: false,
      }}
      onChange={onChange} />

    <div className={'h-[40px] mt-2'}>
      <Button size={'sm'} isDisabled={!!parseError} onClick={() => {
        onUpdate();
      }}>
        同步
      </Button>
    </div>
  </>;
};