import { Input } from '@nextui-org/react';
import { memo, useCallback, useState } from 'react';
import { ILs } from '../../../../../store/slice/logicSlice.ts';
import { useSelector } from 'react-redux';
import { genLogicConfigMap } from '../../../../../Logic/nodes/logicConfigMap.ts';

export const DataMixForm = memo(() => {

  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const defaultValue = genLogicConfigMap().configInfo.get(logicState.target[0])?.mixDataFieldMap?.fieldString;
  const [mixForm, setMixForm] = useState(defaultValue);


  const onHandleChangeMappingValue = useCallback((value: string) => {
    setMixForm(value);
    genLogicConfigMap().configInfo.set(
      logicState.target[0],
      {
        mixDataFieldMap: {
          fieldString: value,
        },
      },
    );
  }, [logicState.target]);

  return <>
    <div>
      <small>字段取值路径</small>
      <Input
        type="text"
        placeholder="fieldA.fieldB"
        labelPlacement="outside"
        aria-label={'inputMix'}
        value={mixForm || ''}
        onChange={e => {
          onHandleChangeMappingValue(e.target.value);
        }}
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">streamPre.</span>
          </div>
        }
      />
    </div>
  </>;
});