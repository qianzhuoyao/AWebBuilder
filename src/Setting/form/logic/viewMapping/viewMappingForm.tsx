import { memo, useCallback } from 'react';
import { Input, Select, SelectItem } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import { INs, pix_BX } from '../../../../store/slice/nodeSlice.ts';
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

  const updateBarX = useCallback((x: string) => {
    dispatch(updateNodeConfigInfo({
      id: logicState.target[0],
      infoType: 'viewMapInfo',
      configInfo: {
        ...(logicState.logicNodes[logicState.target[0]]?.configInfo?.viewMapInfo || {}),
        instance: {
          x,
          y: logicState.logicNodes[logicState.target[0]]?.configInfo?.viewMapInfo?.instance?.y,
        },
      },
    }));
  }, [logicState.logicNodes, logicState.target]);

  const updateBarY = useCallback((y: string) => {
    dispatch(updateNodeConfigInfo({
      id: logicState.target[0],
      infoType: 'viewMapInfo',
      configInfo: {
        ...(logicState.logicNodes[logicState.target[0]]?.configInfo?.viewMapInfo || {}),
        instance: {
          y,
          x: logicState.logicNodes[logicState.target[0]]?.configInfo?.viewMapInfo?.instance?.x,
        },
      },
    }));
  }, [logicState.logicNodes, logicState.target]);

  return <>
    <div>
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
    </div>
    {/*柱状图*/}
    {NodesState.list[logicState.logicNodes[logicState.target[0]]?.configInfo?.viewMapInfo?.bindViewNodeId || '']?.instance?.type === pix_BX &&
      <>
        <div>
          <small>X轴字段</small>
          <Input size={'sm'} labelPlacement={'outside'} placeholder={'a.b.c'}
                 value={logicState.logicNodes[logicState.target[0]]?.configInfo?.viewMapInfo?.instance?.x}
                 onChange={e => {
                   updateBarX(e.target.value);
                 }}
          ></Input>
        </div>
        <div>
          <small>Y轴字段</small>
          <Input size={'sm'} labelPlacement={'outside'} placeholder={'a.b.c'}
                 value={logicState.logicNodes[logicState.target[0]]?.configInfo?.viewMapInfo?.instance?.y}

                 onChange={e => {
                   updateBarY(e.target.value);
                 }}
          ></Input>
        </div>
      </>
    }
  </>;
});