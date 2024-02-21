import { signalLogicNode } from '../base.ts';
import { logic_U_get } from '../../store/slice/nodeSlice.ts';
import remoteSync from '../../assets/widgetIcon/remote-sync.svg';

interface IDataReq {
  data: number;
}

export const buildDataSyncNode = () => {

  const dataSyncReq = signalLogicNode<IDataReq, IDataReq>({
    id: logic_U_get,
    type: 'remote',
    src: remoteSync,
    tips: '发送一个请求到后端',
    name: '同步器',
  });
  dataSyncReq.signalIn('logic_U_get-port-in-0', ({ fromNodes }) => {
    console.log({
      fromNodes,
    });
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });

  dataSyncReq.signalOut((params) => {
    console.log({
      params,
    });
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });

};