import { signalLogicNode } from '../base.ts';
import { ENCRYPTION_METHODS, IEncryptionConfigInfo } from './logicConfigMap.ts';
import { logic_ENC_get } from '../../store/slice/nodeSlice.ts';
import enc from '../../assets/widgetIcon/fluent-mdl2--encryption.svg';
import { of } from 'rxjs';
import { AES, MD5 } from 'crypto-js';


const startEnc = <T, >(data: Record<string, T>, methods: typeof ENCRYPTION_METHODS[number], key: string) => {
  if (methods === 'MD5') {
    return MD5(JSON.stringify(data));
  } else if (methods === 'AES') {
    return AES.encrypt(JSON.stringify(data), key);
  } else {
    return '';
  }
};
/**
 * 加密器
 */
export const encryption = () => {

  const Encryption = signalLogicNode<
    { encryptionConfigInfo: IEncryptionConfigInfo },
    unknown,
    unknown
  >({
    id: logic_ENC_get,
    type: 'mix',
    src: enc,
    tips: '将输入的内容加密并输出',
    name: '加密器',
  });
  Encryption.signalIn('in-0', (value) => {
    console.log(value, 'bifsf');
    return of(value?.pre);
  });

  /**
   * 如果输入对象则加密对象值
   * 否则转化为字符串并加密
   */
  Encryption.signalOut<{
    pre: any
  }>('out', (value) => {
    console.log(value, 'forTakeFormm');
    //覆盖

    const encValue = startEnc(
      value.pre,
      value.config.encryptionConfigInfo.encryptionMethod,
      value.config.encryptionConfigInfo.publicKey,
    );
    console.log(encValue.toString(),'encValue');
    return of(encValue.toString());
  });

};