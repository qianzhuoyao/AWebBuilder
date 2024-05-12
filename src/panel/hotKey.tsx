import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fromEvent,
  filter,
  repeat,
  switchMap,
  zip,
  map,
  takeUntil,
  concatMap,
  merge,
  tap,
} from "rxjs";
import {
  updateIsSelection,
  updatePanelTickUnit,
} from "../store/slice/panelSlice";
import { AR_PANEL_DOM_ID, ATTR_TAG, NODE_TYPE_CODE } from "../contant";
import { updatePosition, updateTargets } from "../store/slice/nodeSlice";
import { checkMouseDownInArea } from "../comp/mousdownArea.ts";
import { useTakePanel } from "../comp/useTakeStore.tsx";
import { emitBlockHideBox } from "../emit/emitBlock.ts";
import { useTakeNodeData } from "../comp/useTakeNodeData.tsx";

const scroll = <T,>(filter: (e: WheelEvent) => T) => {
  return fromEvent<WheelEvent>(document, "mousewheel").pipe(
    map((e) => {
      return filter(e);
    })
  );
};
const createMouseDown = <T,>(filter?: (e: MouseEvent) => T) => {
  return fromEvent<MouseEvent>(document, "mousedown").pipe(
    map((ev) => {
      return filter && filter(ev);
    })
  );
};
const createMouseUp = <T,>(filter?: (e: MouseEvent) => T) => {
  return fromEvent<MouseEvent>(document, "mouseup").pipe(
    map((ev) => {
      return filter && filter(ev);
    })
  );
};
const createKeyDown = (code: string) => {
  return fromEvent<KeyboardEvent>(document, "keydown").pipe(
    filter((event) => {
      return event.key === code;
    })
  );
};
const createKeyUp = (code?: string) => {
  return fromEvent<KeyboardEvent>(document, "keyup").pipe(
    filter((event) => {
      if (code === void 0) {
        return true;
      } else {
        return event.key === code;
      }
    })
  );
};
const useZoomKeyEvent = () => {
  const dispatch = useDispatch();
  const panelId = AR_PANEL_DOM_ID;
  const PanelState = useTakePanel();
  useEffect(() => {
    const dom = document.getElementById(panelId);
    if (!dom) {
      return;
    }

    const keyDown$ = createKeyDown("f");
    const keyUp$ = createKeyUp();
    const scroll$ = scroll<number>((e) => e.deltaY);

    const mouseScroll$ = keyDown$.pipe(
      switchMap(() => scroll$.pipe(takeUntil(keyUp$)))
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const subscription = zip(keyDown$, mouseScroll$).subscribe(([_, w]) => {
      emitBlockHideBox();
      if (w > 0) {
        dispatch(
          updatePanelTickUnit(Number((PanelState.tickUnit + 0.1).toFixed(1)))
        );
      } else {
        dispatch(
          updatePanelTickUnit(Number((PanelState.tickUnit - 0.1).toFixed(1)))
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [PanelState.tickUnit, dispatch, panelId]);
};

/*
 * UP / DOWN / LEFT / RIGHT ARROW MOVE TARGET NODE
 */
const useMoveTarget = () => {
  const dispatch = useDispatch();
  const NodesState = useTakeNodeData();
  const upKeyDown$ = createKeyDown("ArrowUp").pipe(
    tap(() => {
      dispatch(
        updatePosition({
          id: NodesState.targets[0],
          x: NodesState.list[NodesState.targets[0]].x,
          y: NodesState.list[NodesState.targets[0]].y - 1,
        })
      );
    })
  );
  const downKeyDown$ = createKeyDown("ArrowDown").pipe(
    tap(() => {
      dispatch(
        updatePosition({
          id: NodesState.targets[0],
          x: NodesState.list[NodesState.targets[0]].x,
          y: NodesState.list[NodesState.targets[0]].y + 1,
        })
      );
    })
  );
  const leftKeDown$ = createKeyDown("ArrowLeft").pipe(
    tap(() => {
      dispatch(
        updatePosition({
          id: NodesState.targets[0],
          x: NodesState.list[NodesState.targets[0]].x - 1,
          y: NodesState.list[NodesState.targets[0]].y,
        })
      );
    })
  );
  const rightKeDown$ = createKeyDown("ArrowRight").pipe(
    tap(() => {
      dispatch(
        updatePosition({
          id: NodesState.targets[0],
          x: NodesState.list[NodesState.targets[0]].x + 1,
          y: NodesState.list[NodesState.targets[0]].y,
        })
      );
    })
  );

  useEffect(() => {
    const subscription = merge(
      upKeyDown$,
      downKeyDown$,
      leftKeDown$,
      rightKeDown$
    ).subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, [downKeyDown$, leftKeDown$, rightKeDown$, upKeyDown$]);
};

const useSelectionKeyEvent = () => {
  const dispatch = useDispatch();
  const panelId = AR_PANEL_DOM_ID;
  const PanelState = useTakePanel();
  useEffect(() => {
    const dom = document.getElementById(panelId);
    if (!dom) {
      return;
    }

    const keyDown$ = createKeyDown("q");
    const keyUp$ = createKeyUp();
    const mousedown$ = createMouseDown();
    const mouseup$ = createMouseUp();

    const S$ = keyDown$.pipe(
      map(() => {
        // dispatch(updatePanelLockTransform(true));
        dispatch(updateIsSelection(true));
      }),
      concatMap(() =>
        mousedown$.pipe(
          takeUntil(
            zip(mouseup$, keyUp$).pipe(
              map(() => {
                dispatch(updateIsSelection(false));
              })
            )
          )
        )
      )
    );

    const subscription = S$.pipe(repeat()).subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [PanelState.tickUnit, dispatch, panelId]);
};

const useDefaultBlurEvent = () => {
  const dispatch = useDispatch();
  const panelId = AR_PANEL_DOM_ID;
  const PanelState = useTakePanel();
  useEffect(() => {
    const dom = document.getElementById(panelId);
    if (!dom) {
      return;
    }

    const mousedown$ = createMouseDown((e) => e);

    const D$ = mousedown$.pipe(
      map((d) => {
        if (d?.target instanceof HTMLElement) {
          if (d?.target.getAttribute(ATTR_TAG) !== NODE_TYPE_CODE) {
            if (
              checkMouseDownInArea(
                {
                  x: d.pageX,
                  y: d.pageY,
                },
                document.getElementById(AR_PANEL_DOM_ID)
              )
            ) {
              console.log(
                d?.target,
                d?.target.getAttribute(ATTR_TAG),
                "osalfiafgasfaswfwfwfwfw"
              );
              dispatch(updateTargets([]));
            }
            // dispatch(updateTargets([]));
          }
        }
      })
    );

    const subscription = D$.subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [PanelState.tickUnit, dispatch, panelId]);
};

//快捷键
export const useCustomHotKeys = () => {
  //放大快捷键
  useZoomKeyEvent();
  //多选快捷键
  useSelectionKeyEvent();
  //自动取消焦点
  useDefaultBlurEvent();
  //方向键移动选中的节点
  useMoveTarget();
};
