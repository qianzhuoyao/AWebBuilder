import { memo, useCallback } from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import { INs } from '../../../../store/slice/nodeSlice.ts';
import { ILs, updateNodeConfigInfo } from '../../../../store/slice/logicSlice.ts';

export const ViewMappingForm = memo(() => {

  const dispatch = useDispatch();

  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });

  const onHandleUpdateBindNode = useCallback((keys: string[]) => {
    if (keys.length === 1) {
      dispatch(updateNodeConfigInfo({
        id: logicState.target[0],
        infoType: 'viewMapInfo',
        configInfo: {
          ...(logicState.logicNodes[logicState.target[0]]?.configInfo?.viewMapInfo || {}),
          bindViewNodeId: keys[0],
        },
      }));
    }
  }, [logicState.logicNodes, logicState.target]);

  return <>
    <small>视图组件</small>
    <Select
      size={'sm'}
      className="max-w-xs mt-1"
      labelPlacement={'outside'}
      selectedKeys={[logicState.logicNodes[logicState.target[0]]?.configInfo?.viewMapInfo?.bindViewNodeId || '']}
      onSelectionChange={selection => {
        onHandleUpdateBindNode([...selection] as string[]);
      }}
    >
      {Object.values(NodesState.list).map((node) => (
        <SelectItem key={node.id} value={node.id}>
          {node.alias}
        </SelectItem>
      ))}
    </Select>
  </>;
});