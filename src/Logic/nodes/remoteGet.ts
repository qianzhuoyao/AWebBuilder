import { signalLogicNode } from '../base.ts';
import { logic_D_get } from '../../store/slice/nodeSlice.ts';
import remoteGet from '../../assets/widgetIcon/remote_get.svg';
import { from, of } from 'rxjs';
import { IRemoteReqInfo } from './logicConfigMap.ts';


export const buildDataReqNode = () => {

  const dataReq = signalLogicNode<
    { remoteReqInfo: IRemoteReqInfo },
    unknown,
    unknown
  >({
    id: logic_D_get,
    type: 'remote',
    src: remoteGet,
    tips: '获取来自服务器上的数据',
    name: '获取器',
  });
  dataReq.signalIn('in-0', (value) => {
    return of(value.pre);
  });

  dataReq.signalOut<any>('out', (value) => {


    return from(new Promise((resolve, reject) => {
      const query = () => fetch(value?.config?.remoteReqInfo?.protocol + '://' + value.config?.remoteReqInfo?.url || '',
        {
          method: value.config?.remoteReqInfo?.method || 'post',
          body: value.pre || null,
        }).then((res) => res.json()).catch(e => {
        reject(e);
      });
      query().then(res => {
        resolve({
          data: res,
        });
      });
    }));
  });

};