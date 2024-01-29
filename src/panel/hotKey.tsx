import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDispatch, useSelector } from "react-redux";
import { fromEvent, Subject, repeat, withLatestFrom } from "rxjs";
import { IPs, updatePanelTickUnit } from "../store/slice/panelSlice";
//快捷键
export const useCustomHotKeys = () => {
  const dispatch = useDispatch();
  const panelId = "Ar-Panel";

  let scaleOb: Subject<KeyboardEvent> | null = null;

  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    console.log(state, "statescvsfv");
    return state.panelSlice;
  });

  useEffect(() => {
    scaleOb = new Subject<KeyboardEvent>();
    //注册鼠标操作流
    const dom = document.getElementById(panelId);
    if (!dom) {
      return;
    }
    const md = fromEvent<MouseEvent>(dom, "mousedown");
    const mo = fromEvent<MouseEvent>(dom, "mousemove");
    const up = fromEvent<MouseEvent>(dom, "mouseup");
    const wh = fromEvent<WheelEvent>(dom, "mousewheel");

    wh.pipe(withLatestFrom(scaleOb)).subscribe(([w, s]) => {
      if (s.code === "KeyF") {
        if (w.deltaY > 0) {
          dispatch(updatePanelTickUnit(PanelState.tickUnit + 0.1));
          //放大
        } else {
          //缩小
          dispatch(updatePanelTickUnit(PanelState.tickUnit - 0.1));
        }
      }
      console.log(w, s, "w0sss");
    });

    return () => {
      scaleOb?.unsubscribe();
    };
  }, []);

  // f 放大缩小
  useHotkeys("keyF", (e) => {
    console.log(e, "Caught a hotkey!");
    const dom = document.getElementById(panelId);
    if (!dom) {
      return;
    }
    scaleOb?.next(e);
  });
};
