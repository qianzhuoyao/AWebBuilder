import { ReplaySubject } from "rxjs";
import { createSingleInstance } from "../comp/createSingleInstance";

interface IPosition {
  x: number;
  y: number;
}
interface IRotate {
  rotate: number;
}
interface ISize {
  w: number;
  h: number;
}
export interface IEmitter {
  type:
    | "render"
    | "positionChange"
    | "sizeChange"
    | "rotateChange"
    | "ZIndexChange"
    | "displayBox"
    | "hideBox";
  pack?: Partial<IPosition & ISize & IRotate & { zIndex: number; id: string }>;
}

const block = () => {
  const blockObservable = new ReplaySubject<IEmitter>();
  return {
    blockObservable,
  };
};

const getBlockObservableFn = createSingleInstance(block);

export const emitBlockReRender = () => {
  getBlockObservableFn().blockObservable.next({
    type: "render",
  });
};

export const emitBlockSetPosition = (position: IPosition) => {
  getBlockObservableFn().blockObservable.next({
    type: "positionChange",
    pack: position,
  });
};

export const emitBlockDisplayBox = () => {
  getBlockObservableFn().blockObservable.next({
    type: "displayBox",
    pack: {},
  });
};

export const emitBlockHideBox = () => {
  getBlockObservableFn().blockObservable.next({
    type: "hideBox",
    pack: {},
  });
};

export const emitBlockSetZIndex = (zIndex: number, id: string) => {
  getBlockObservableFn().blockObservable.next({
    type: "ZIndexChange",
    pack: { zIndex, id },
  });
};
export const emitBlockSetSize = (size: ISize) => {
  getBlockObservableFn().blockObservable.next({
    type: "sizeChange",
    pack: size,
  });
};

export const emitBlockSetRotate = (rotate: number) => {
  getBlockObservableFn().blockObservable.next({
    type: "rotateChange",
    pack: { rotate },
  });
};

export const emitBlockSubscribe = (subscribe: (params: IEmitter) => void) => {
  return getBlockObservableFn().blockObservable.subscribe(subscribe);
};
