/**
 * panel 对外公布的订阅
 * 当panel 的 对齐方式变更时触发
 */

import { Dayjs } from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { ICoordinateSystem } from './coordinateSystem';
import { IWidget } from '../templateSlot';
import { OperationLayer } from 'Layer/operationLayer';
//对齐修正
export const ALIGN_TRIGGER = 'ALIGN_TRIGGER' as const;
//通知slot发放坐标副本
export const BACKUP_COORDINATOR_TRIGGER = 'BACKUP_COORDINATOR_TRIGGER' as const;
//缩放
export const SCALE_COORDINATOR_TRIGGER = 'SCALE_COORDINATOR_TRIGGER' as const;
//加载
export const LOADING_TRIGGER = 'LOADING_TRIGGER' as const;
//transform start
export const TRANSFORM_START_TRIGGER = 'TRANSFORM_START_TRIGGER' as const;
//transform moving
export const TRANSFORM_MOVING_TRIGGER = 'TRANSFORM_MOVING_TRIGGER' as const;
//transform END
export const TRANSFORM_END_TRIGGER = 'TRANSFORM_END_TRIGGER' as const;
//edit状态
export const EDIT_STATUS_TRIGGER = 'EDIT_STATUS_TRIGGER' as const;
//创建widget
export const CREATE_WIDGET = 'CREATE_WIDGET' as const;
//图层更换
export const LAYOUT_CHANGE = 'LAYOUT_CHANGE' as const;

//基于坐标系的多选操作
export const PANEL_SELECTION_TRIGGER = 'PANEL_SELECTION_TRIGGER' as const;

export interface ITransformValue {
  vpt: number[];
  lastPosX: number;
  lastPosY: number;
}

export interface ISelectionParams {
  downAbsolutePointer: {
    x: number;
    y: number;
  };
  moveAbsolutePointer: {
    x: number;
    y: number;
  };
}

interface ISelectionTrigger {
  type: typeof PANEL_SELECTION_TRIGGER;
  time: Dayjs;
  value: ISelectionParams;
}
interface ILayoutTrigger {
  type: typeof LAYOUT_CHANGE;
  time: Dayjs;
  value: OperationLayer;
}

interface ICreateWidgetTrigger {
  type: typeof CREATE_WIDGET;
  time: Dayjs;
  value: IWidget;
}

interface IEditTrigger {
  type: typeof EDIT_STATUS_TRIGGER;
  time: Dayjs;
  value: boolean;
}

interface ITransformStartCoordinatorTrigger {
  type: typeof TRANSFORM_START_TRIGGER;
  time: Dayjs;
  value: ITransformValue;
}
interface ITransformMovingCoordinatorTrigger {
  type: typeof TRANSFORM_MOVING_TRIGGER;
  time: Dayjs;
  value: ITransformValue;
}
interface ITransformEndCoordinatorTrigger {
  type: typeof TRANSFORM_END_TRIGGER;
  time: Dayjs;
  value: any;
}

interface IBackUpCoordinatorTrigger {
  type: typeof BACKUP_COORDINATOR_TRIGGER;
  time: Dayjs;
  value: ICoordinateSystem;
}

interface ICoordinateScaleTrigger {
  type: typeof SCALE_COORDINATOR_TRIGGER;
  time: Dayjs;
  value: number;
}
interface ILoadingTrigger {
  type: typeof LOADING_TRIGGER;
  time: Dayjs;
  value: boolean;
}

interface IAlignGridTrigger {
  type: typeof ALIGN_TRIGGER;
  time: Dayjs;
  value: 'just-vertex' | 'strict-vertex' | 'none';
}

export type ISendMsg =
  | IAlignGridTrigger
  | IBackUpCoordinatorTrigger
  | IEditTrigger
  | ICreateWidgetTrigger
  | ILayoutTrigger;
export type IAcceptMsg =
  | ICoordinateScaleTrigger
  | ILoadingTrigger
  | ITransformStartCoordinatorTrigger
  | ITransformEndCoordinatorTrigger
  | ITransformMovingCoordinatorTrigger
  | ISelectionTrigger;

/**
 * 讯息
 *
 * 发送给panel  panelSendObservable
 * panel 接收 panelAcceptObservable
 * @var {[type]}
 */
let panelSendObservable$: ReplaySubject<ISendMsg> | null = null;
let panelAcceptObservable$: ReplaySubject<IAcceptMsg> | null = null;
/**
 * 来源于panel的消息,
 *
 * @return  {ReplaySubject<IMsg>}[return description]
 */
export const getPanelSendObservable = (): ReplaySubject<ISendMsg> => {
  if (!panelSendObservable$) {
    panelSendObservable$ = new ReplaySubject<ISendMsg>();
  }
  return panelSendObservable$;
};

export const getPanelAcceptObservable = (): ReplaySubject<IAcceptMsg> => {
  if (!panelAcceptObservable$) {
    panelAcceptObservable$ = new ReplaySubject<IAcceptMsg>();
  }
  return panelAcceptObservable$;
};
/**
 *
 *
 * @return  {[type]}  [return description]
 */
export const removePanelSendObservable = () => {
  if (panelSendObservable$) {
    panelSendObservable$.unsubscribe();
  }
  panelSendObservable$ = null;
};

export const removePanelAcceptObservable = () => {
  if (panelAcceptObservable$) {
    panelAcceptObservable$.unsubscribe();
  }
  panelAcceptObservable$ = null;
};
