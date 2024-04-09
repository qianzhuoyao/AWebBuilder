import { memo, useEffect, useMemo, useState } from "react";
import { INodeType, INs, IViewNode, pix_BX } from "../store/slice/nodeSlice";
import { signalViewNode } from "./baseViewNode";
import { viewUpdateReducer } from "../emit/emitChart";
import { subscribeViewCacheUpdate } from "../panel/data";
import { useSelector } from "react-redux";
import { runChartOption } from "../comp/useChartOption";
import { BaseChart } from "./chart";
import { IPs } from "../store/slice/panelSlice";
import { useAutoSubscription } from "../comp/autoSubscription";

const MemoChart = memo(
  ({
    type,
    node,
    isTemp,
    tickUnit,
    parseOption,
    reRender,
  }: {
    type: INodeType;
    node: IViewNode;
    reRender: boolean;
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
        [parseOption, reRender]
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
  const [reRender, setReRender] = useState(false);
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
  }, [NodesState?.list, cid, reRender]);

  useAutoSubscription(cid).render((value) => {
    setParseOptionString(value?.chart || "");
    setReRender(!reRender);
  });

  return (
    <MemoChart
      reRender={reRender}
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
