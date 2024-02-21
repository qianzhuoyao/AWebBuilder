import { signalLogicNode } from '../base.ts';
import { logic_D_get } from '../../store/slice/nodeSlice.ts';
import remoteGet from '../../assets/widgetIcon/remote_get.svg';

interface IDataReq {
  data: number;
}

export const buildDataReqNode = () => {

  const dataReq = signalLogicNode<IDataReq, IDataReq>({
    id: logic_D_get,
    type: 'remote',
    src: remoteGet,
    tips: '获取来自服务器上的数据',
    name: '获取器',
  });
  dataReq.signalIn('logic_D_get-port-in-0', ({ fromNodes }) => {
    console.log({
      fromNodes,
    }, 'fromNodessss');
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });

  dataReq.signalOut((params) => {

    return new Promise(resolve => {
      setTimeout(() => {
        console.log({
          params,
        }, 'fromNodessss=1');
        resolve({
          data: 12,
        });
      }, 2000);
    });
  });

};