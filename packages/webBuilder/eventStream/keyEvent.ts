import { first, fromEvent, of, repeat, take } from 'rxjs';

export interface IKeyOption {
  take?: number;
  first?: boolean;
  repeat?: boolean;
}

export const keyDownEvent$ = fromEvent<KeyboardEvent>(document, 'keydown');
export const keyUpEvent$ = fromEvent<KeyboardEvent>(document, 'keyup');

export const keyDown = (callback?: (e: KeyboardEvent) => void, option?: IKeyOption) => {
  let ob = keyDownEvent$.pipe();
  if (option?.take) {
    ob = ob.pipe(take(option.take));
  }
  if (option?.first) {
    ob = ob.pipe(first());
  }
  if (option?.repeat) {
    ob = ob.pipe(repeat());
  }
  const sp = ob.subscribe((e) => {
    callback && callback(e);
  });
  return {
    subscription: sp,
    observable: ob,
  };
};
export const keyUp = (callback?: (e: KeyboardEvent) => void, option?: IKeyOption) => {
  let ob = keyUpEvent$.pipe();
  if (option?.take) {
    ob = ob.pipe(take(option.take));
  }
  if (option?.first) {
    ob = ob.pipe(first());
  }
  if (option?.repeat) {
    ob = ob.pipe(repeat());
  }
  const sp = ob.subscribe((e) => {
    callback && callback(e);
  });
  return {
    subscription: sp,
    observable: ob,
  };
};
