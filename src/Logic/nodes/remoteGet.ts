import { signalLogicNode } from '../base.ts';
import { logic_D_get } from '../../store/slice/nodeSlice.ts';
import remoteGet from '../../assets/widgetIcon/remote_get.svg';
import { toast } from 'react-toastify';

interface IDataReq {
  data: any;
}

export const buildDataReqNode = () => {

  const dataReq = signalLogicNode<IDataReq, IDataReq>({
    id: logic_D_get,
    type: 'remote',
    src: remoteGet,
    tips: '获取来自服务器上的数据',
    name: '获取器',
  });
  dataReq.signalIn('in-0', async (args, node) => {
    try {
      console.log(args, node, 'fromNodessss');

      const query = () => fetch(node?.configInfo?.remoteReqInfo?.protocol + '://' + node.configInfo?.remoteReqInfo?.url || '', {
        method: node?.configInfo?.remoteReqInfo?.method || 'post',
        body: node?.configInfo?.remoteReqInfo?.method === 'post' ? JSON.stringify(node?.configInfo?.remoteReqInfo?.params || {}) : null,
      }).then((res) => res.json());

      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        const res = await query();
        resolve({
          data: res,
        });
      });
    } catch (e) {
      toast.error(e.message);
      throw new Error(e.message);
    }
  });

  dataReq.signalOut((params) => {
    console.log(params, 'fromNodessss==params');
    return new Promise(resolve => {
      resolve({
        data: params,
      });
    });
  });

};