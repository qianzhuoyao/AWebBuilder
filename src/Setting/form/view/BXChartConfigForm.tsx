import { AInput } from '../../../comp/AInput.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { INs, moveNode, updateAlias } from '../../../store/slice/nodeSlice.ts';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const PixBXChartConfigForm = () => {
  const dispatch = useDispatch();
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });

  const onHandleChangeY = useCallback((y: string) => {
    if (y !== '0') {
      Number(y) ? dispatch(moveNode([{
        id: NodesState.list[NodesState.targets[0]].id,
        newY: Number(y),
        newX: NodesState.list[NodesState.targets[0]].x,
      }])) : toast.error('y点输入不合法');
    } else {
      dispatch(moveNode([{
        id: NodesState.list[NodesState.targets[0]].id,
        newY: Number(y),
        newX: NodesState.list[NodesState.targets[0]].x,
      }]));
    }

  }, [NodesState.list, NodesState.targets]);

  const onHandleChangeX = useCallback((x: string) => {
    console.log(x, 'conHandleChangeX');
    if (x !== '0') {
      Number(x) ? dispatch(moveNode([{
        id: NodesState.list[NodesState.targets[0]].id,
        newX: Number(x),
        newY: NodesState.list[NodesState.targets[0]].y,
      }])) : toast.error('x点输入不合法');
    } else {
      dispatch(moveNode([{
        id: NodesState.list[NodesState.targets[0]].id,
        newX: Number(x),
        newY: NodesState.list[NodesState.targets[0]].y,
      }]));
    }

  }, [NodesState.list, NodesState.targets]);

  const updateNodeAlias = useCallback((alias: string) => {
    if (Object.values(NodesState.list).some(node => node.alias === alias)) {
      toast.error('别名不可以重复');
    } else {
      dispatch(updateAlias({
        id: NodesState.targets[0],
        alias: alias,
      }));
    }

  }, [NodesState.targets]);

  console.log(NodesState, 'sdasdadasdsadadfffNodesState');
  return <>
    <div className={'flex mb-1'}>
      <small>{
        NodesState.targets.length === 1 ? '节点当前位置' : '选中节点过多'
      }</small>
    </div>
    <div className={'flex'}>
      {
        NodesState.targets.length === 1 ?
          <><AInput placeholder="x" className="w-[250px] mr-2" size="xs"
                    onChange={e => {
                      onHandleChangeX(e.target.value);
                    }}
                    value={String(Math.floor(NodesState.list[NodesState.targets[0]].x))}
          />
            <AInput placeholder="y" className="w-[250px] mr-2" size="xs"
                    onChange={e => {
                      onHandleChangeY(e.target.value);
                    }}
                    value={String(Math.floor(NodesState.list[NodesState.targets[0]].y))}
            /></> : <>-</>
      }
    </div>
    <div className={'flex my-1 border-t-1 border-default-100'}>
      <small>{
        NodesState.targets.length === 1 ? '别名' : '选中节点过多'
      }</small>
    </div>
    <div>
      <AInput
        size={'xs'}
        type="email"
        label="别名"
        value={NodesState.list[NodesState.targets[0]].alias}
        placeholder="别名"
        labelPlacement="outside"
        onChange={(e) => {
          updateNodeAlias(e.target.value);
        }}
      ></AInput>
    </div>
  </>;
};