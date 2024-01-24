import { Observable, first, fromEvent, repeat, take } from 'rxjs';

export interface IPipeOption {
  take?: number;
  first?: boolean;
  repeat?: boolean;
}
export const mouseUpEvent$ = fromEvent<MouseEvent>(document, 'mouseup');

export const mouseDownEvent$ = fromEvent<MouseEvent>(document, 'mousedown');

export const mouseMoveEvent$ = fromEvent<MouseEvent>(document, 'mousemove');

export const keyDownEvent$ = fromEvent<KeyboardEvent>(document, 'keydown');

export const keyUpEvent$ = fromEvent<KeyboardEvent>(document, 'keyup');

const eventPipe = <T>(observable: Observable<T>, options?: IPipeOption) => {
  if (options?.take) {
    observable = observable.pipe(take(options.take));
  }
  if (options?.first) {
    observable = observable.pipe(first());
  }
  if (options?.repeat) {
    observable = observable.pipe(repeat());
  }
};

/**
 * 鼠标按下
 *
 * @param   {MouseEvent}   callback  [callback description]
 *
 * @return  {IPipeOption}            [return description]
 */
export const mouseDown = (callback?: (e: MouseEvent) => void, options?: IPipeOption) => {
  const ob = mouseDownEvent$.pipe();
  eventPipe<MouseEvent>(ob, options);
  const sp = ob.subscribe((e) => {
    callback && callback(e);
  });
  return {
    subscription: sp,
    observable: ob,
  };
};

/**
 * 鼠标移动
 *
 * @param   {MouseEvent}   callback  [callback description]
 *
 * @return  {IPipeOption}            [return description]
 */
export const mouseMove = (callback?: (e: MouseEvent) => void, options?: IPipeOption) => {
  const ob = mouseMoveEvent$.pipe();
  eventPipe<MouseEvent>(ob, options);
  const sp = ob.subscribe((e) => {
    callback && callback(e);
  });
  return {
    subscription: sp,
    observable: ob,
  };
};

/**
 * 鼠标抬起
 *
 * @param   {MouseEvent}   callback  [callback description]
 *
 * @return  {IPipeOption}            [return description]
 */
export const mouseUp = (callback?: (e: MouseEvent) => void, options?: IPipeOption) => {
  const ob = mouseUpEvent$.pipe();
  eventPipe<MouseEvent>(ob, options);
  const sp = ob.subscribe((e) => {
    callback && callback(e);
  });
  return {
    subscription: sp,
    observable: ob,
  };
};

/**
 * 键盘按下
 *
 * @param   {KeyboardEvent}  callback  [callback description]
 *
 * @return  {IPipeOption}              [return description]
 */
export const keyDown = (callback?: (e: KeyboardEvent) => void, options?: IPipeOption) => {
  const ob = keyDownEvent$.pipe();
  eventPipe<KeyboardEvent>(ob, options);
  const sp = ob.subscribe((e) => {
    callback && callback(e);
  });
  return {
    subscription: sp,
    observable: ob,
  };
};

/**
 * 键盘抬起
 *
 * @param   {KeyboardEvent}  callback  [callback description]
 *
 * @return  {IPipeOption}              [return description]
 */
export const keyUp = (callback?: (e: KeyboardEvent) => void, options?: IPipeOption) => {
  const ob = keyUpEvent$.pipe();
  eventPipe<KeyboardEvent>(ob, options);
  const sp = ob.subscribe((e) => {
    callback && callback(e);
  });
  return {
    subscription: sp,
    observable: ob,
  };
};
