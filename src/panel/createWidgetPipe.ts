import { fromEvent, map, switchMap, takeUntil } from "rxjs";
export const setTranslate = (
  element: HTMLElement,
  pos: {
    x: number;
    y: number;
  }
) => {
  element.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
};

export const createLayerSrc = <K extends keyof HTMLElementTagNameMap>(
  type: K
) => {
  const ele = document.createElement(type);
  document.body.appendChild(ele);
  return ele;
};

export const cloneLayerSrc = (picId: string): HTMLElement | null => {
  const pic = document.getElementById(picId);
  if (!pic) {
    return null;
  }
  const clonePic = pic.cloneNode(true);
  if (clonePic instanceof HTMLElement) {
    clonePic.id = "clone" + pic.id;
    document.body.appendChild(clonePic);
  }
  return clonePic as HTMLElement;
};

export const getTranslate = (element: HTMLElement) => {
  const style = getComputedStyle(element);
  const regExp = /matrix\((\d+,\s){4}(\d+),\s(\d+)/i;
  const result = style.transform.match(regExp);
  if (result) {
    return {
      x: parseInt(result[2], 10),
      y: parseInt(result[3], 10),
    };
  } else {
    return {
      x: 0,
      y: 0,
    };
  }
};

export const setWidgetStream = <T, M>(
  id: string,
  callback?: {
    down?: (e: MouseEvent) => T;
    move?: (e: MouseEvent, pipeValue?: T) => M;
    up?: (e: MouseEvent, pipeValue?: T, mixValue?: M) => void;
  }
) => {
  const dom = document.getElementById(id);

  if (!dom) {
    return;
  }

  const d$ = fromEvent<MouseEvent>(dom, "mousedown");
  const m$ = fromEvent<MouseEvent>(document, "mousemove");
  const u$ = fromEvent<MouseEvent>(document, "mouseup");

  return d$
    .pipe(
      map((event) => {
        let pipeValue: undefined | T = undefined;
        if (callback && callback.down) {
          pipeValue = callback.down(event);
        }

        return {
          pipeValue,
          pos: getTranslate(dom),
          event,
        };
      }),
      switchMap((initialState) => {
        let mixValue: undefined | M = undefined;
        const pipeV = initialState.pipeValue;
        const initialPos = initialState.pos;
        const { clientX, clientY } = initialState.event;
        return m$.pipe(
          map((moveEvent) => {
            if (callback && callback.move) {
              mixValue = callback.move(moveEvent, initialState.pipeValue);
            }
            return {
              mixValue,
              x: moveEvent.clientX - clientX + initialPos.x,
              y: moveEvent.clientY - clientY + initialPos.y,
            };
          }),
          takeUntil(
            u$.pipe(
              map((e) => {
                if (callback) {
                  callback.up && callback.up(e, pipeV, mixValue);
                }
              })
            )
          )
        );
      })
    )
    .subscribe();
};
