import { Input } from '@nextui-org/react';
import { memo, useCallback } from 'react';
import { ILs, updateNodeConfigInfo } from '../../../../../store/slice/logicSlice.ts';
import { useDispatch, useSelector } from 'react-redux';

export const DataMixForm = memo(() => {
  const dispatch = useDispatch();
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const onHandleChangeMappingValue = useCallback((value: string) => {
    dispatch(updateNodeConfigInfo({
      id: logicState.target[0],
      infoType: 'mixDataFieldMap',
      configInfo: {
        ...(logicState.logicNodes[logicState.target[0]]?.configInfo?.mixDataFieldMap || {}),
        fieldString: value,
      },
    }));
  }, [logicState.logicNodes, logicState.target]);

  return <>
    <div>
      <small>字段取值路径</small>
      <Input
        type="url"
        placeholder="fieldA.fieldB"
        labelPlacement="outside"
        value={logicState.logicNodes[logicState.target[0]]?.configInfo?.mixDataFieldMap?.fieldString}
        onChange={e => {
          onHandleChangeMappingValue(e.target.value);
        }}
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">root.</span>
          </div>
        }
      />
    </div>
  </>;
});