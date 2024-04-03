import { memo, useEffect, useMemo, useState } from "react";
import { INodeType, INs, IViewNode, pix_BX } from "../store/slice/nodeSlice";
import { signalViewNode } from "./baseViewNode";
import { viewUpdateReducer } from "../emit/emitChart";
import { subscribeViewCacheUpdate } from "../panel/data";
import { useSelector } from "react-redux";
import { runChartOption } from "../comp/useChartOption";
import { BaseChart } from "./chart";
import { IPs } from "../store/slice/panelSlice";

const MemoChart = memo(
  ({
    type,
    node,
    isTemp,
    tickUnit,
    parseOption,
  }: {
    type: INodeType;
    node: IViewNode;
    isTemp: boolean | undefined;
    tickUnit: number;
    parseOption: string;
  }) => (
    <>
      {useMemo(
        () => (
          <BaseChart
            type={type}
            width={isTemp ? 205 : node.w / tickUnit}
            height={isTemp ? 100 : node.h / tickUnit}
            options={runChartOption(node.id, parseOption)}
          />
        ),
        [parseOption]
      )}
    </>
  )
);

const ChartContainer = ({ isInit, cid }: { isInit: boolean; cid: string }) => {
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });
  const [parseOptionString, setParseOptionString] = useState(
    () => (NodesState?.list || {})[cid]?.instance?.option?.chart || ""
  );
  useEffect(() => {
    const sub = viewUpdateReducer(cid, (payload) => {
      setParseOptionString(payload.payload);
    });
    const cacheSub = subscribeViewCacheUpdate(() => {
      if (NodesState?.list) {
        setParseOptionString(
          (NodesState?.list || {})[cid]?.instance?.option?.chart || ""
        );
      }
    });
    return () => {
      sub.unsubscribe();
      cacheSub.unsubscribe();
    };
  }, [NodesState?.list, cid]);

  return (
    <MemoChart
      type={NodesState.list[cid]?.instance?.type}
      node={NodesState.list[cid]}
      isTemp={isInit}
      tickUnit={PanelState.tickUnit}
      parseOption={parseOptionString}
    />
  );
};

export const ChartTemplate = () => {
  const chart = signalViewNode(pix_BX);

  chart.createElement((_, { isInit, id }) => {
    return (
      <>
        <ChartContainer isInit={isInit} cid={id}></ChartContainer>
      </>
    );
  });
};
