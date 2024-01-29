import { useSelector } from "react-redux";
import { IPs } from "../store/slice/panelSlice";
import { useMemo } from "react";

export const AScene = () => {
  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    console.log(state, "statescvsfv");
    return state.panelSlice;
  });

  const leftC = useMemo(() => {
    const { panelLeft, rulerMinX } = PanelState;
    const offset = panelLeft - rulerMinX;
    return offset;
  }, [PanelState]);
  const topC = useMemo(() => {
    const { panelTop, rulerMinY } = PanelState;
    const offset = panelTop - rulerMinY;
    return offset;
  }, [PanelState]);
  const widthC = useMemo(() => {
    const { tickUnit, panelWidth } = PanelState;
    return panelWidth / tickUnit;
  }, [PanelState]);
  const heightC = useMemo(() => {
    const { tickUnit, panelHeight } = PanelState;
    return panelHeight / tickUnit;
  }, [PanelState]);

  return (
    <>
      <div
        className="absolute w-[calc(100%_-_40px)] h-[calc(100%_-_40px)]"
        style={{
          left: "30px",
          top: "30px",
        }}
      >
        <div id="container" className="relative w-full h-full overflow-hidden">
          <div
            id="scene"
            className="absolute bg-[#232324] overflow-hidden"
            style={{
              left: leftC + "px",
              top: topC + "px",
              width: widthC + "px",
              height: heightC + "px",
            }}
          >
            {JSON.stringify(PanelState)}
          </div>
        </div>
      </div>
    </>
  );
};
