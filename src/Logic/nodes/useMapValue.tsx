import { useSelector } from 'react-redux';
import { ILs } from '../../store/slice/logicSlice.ts';

export const useMapValue = (id: string) => {
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  return logicState.logicNodes[id];
};