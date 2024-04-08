import {
  Observable,
  filter,
  fromEvent,
  of,
  tap,
  combineLatest,
  takeUntil,
  repeat,
  concatMap,
  Subscription,
} from "rxjs";

export interface IBothEvent {
  keyDown: (code: string) => IBothEvent;
  subscribe: (callback?: (params: MouseEvent) => void) => Subscription;
}

const bothEvent = (observable: Observable<Event | "start">[]): IBothEvent => {
  return {
    keyDown: (code: string) => {
      return bothEvent(
        observable.concat([
          fromEvent<KeyboardEvent>(document, "keydown").pipe(
            filter((e: KeyboardEvent) => {
              return e.key === code;
            })
          ),
        ])
      );
    },
    subscribe: (callback?: (params: MouseEvent) => void) => {
      return combineLatest(observable)
        .pipe(
          concatMap(() =>
            fromEvent<MouseEvent>(document, "click").pipe(
              tap((e) => {
                callback?.(e);
              })
            )
          ),
          takeUntil(fromEvent<KeyboardEvent>(document, "keyup")),
          repeat()
        )
        .subscribe();
    },
  };
};

/**
 * 
 * 同时按下a和s后触发点击事件
 * 
 *     ofClickAfterKeyDown()
      .keyDown("a")
      .keyDown("s")
      .subscribe((e) => {
        console.log(e, "degggge");
      });
 *
 * @return  {[type]}  [return description]
 */
export const ofClickAfterKeyDown = (): IBothEvent => {
  return bothEvent([of("start")]);
};
