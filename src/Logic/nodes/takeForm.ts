import { signalLogicNode } from '../base.ts';
import { logic_Form_get } from '../../store/slice/nodeSlice.ts';
import formV from '../../assets/widgetIcon/mdi--form.svg';
import { of } from 'rxjs';


//检查器
export const takeForm = () => {

  const TakeForm = signalLogicNode<any>({
    id: logic_Form_get,
    type: 'mix',
    src: formV,
    tips: '表单构建,输出结构json并流出',
    name: '构造器',
  });
  TakeForm.signalIn('in-0', (value) => {
    console.log(value, 'bifsf');
    return of(value?.pre);
  });

  TakeForm.signalOut('out-form', (value) => {
    console.log(value, 'forTakeFormm');
    //覆盖
    const result = value?.config?.formConfigInfo?.mergePre ? Object.assign(
      {},
      value?.pre,
      value?.config?.formConfigInfo?.json,
    ) : value?.config?.formConfigInfo?.json;
    return of(result);
  });

};