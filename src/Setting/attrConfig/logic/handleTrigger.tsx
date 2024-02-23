import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { logic_Dug_Trigger } from '../../../store/slice/nodeSlice.ts';
import { Button } from '@nextui-org/react';
import { useSignalMsg } from '../../../comp/msg.tsx';
import { useSelector } from 'react-redux';
import { ILs } from '../../../store/slice/logicSlice.ts';

export const handleTrigger = () => {
  const config = signalLogicNodeAttrConfig(logic_Dug_Trigger);

  config.setConfigEle(() => {
    const logicState = useSelector((state: { logicSlice: ILs }) => {
      return state.logicSlice;
    });
    const { go } = useSignalMsg(logicState.target[0]);
    const handleClick = () => {
      go();
    };
    return <>
      {logicState.target.length === 1 ? <div className="flex w-full flex-col px-1">
        <Button size={'sm'} onClick={handleClick}>发送</Button>
      </div> : <>选中项数量不对</>}
    </>;
  });
};