import { signalLogicNode } from '../base.ts';
import { logic_U_get } from '../../store/slice/nodeSlice.ts';
import remoteSync from '../../assets/widgetIcon/remote-sync.svg';


export const buildDataSyncNode = () => {

  const dataSyncReq = signalLogicNode({
    id: logic_U_get,
    type: 'remote',
    src: remoteSync,
    tips: '发送一个请求到后端',
    name: '同步器',
  });


};