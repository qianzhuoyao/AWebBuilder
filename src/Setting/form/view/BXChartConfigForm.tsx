import { AInput } from '../../../comp/AInput.tsx';
import { useSelector } from 'react-redux';
import { INs } from '../../../store/slice/nodeSlice.ts';

export const PixBXChartConfigForm = () => {
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  console.log(NodesState,'sdasdadasdsadadfffNodesState');
  return <>
    <div>
      <small>当前位置</small>
      <AInput></AInput>
      <AInput></AInput>
    </div>
  </>;
};