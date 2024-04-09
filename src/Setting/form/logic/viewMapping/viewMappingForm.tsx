import { memo, useCallback, useState } from "react";
import { Select, SelectItem, Selection } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { ILs } from "../../../../store/slice/logicSlice.ts";
import { useFilterViewNode } from "../../../../panel/useFilter.tsx";
import { genLogicConfigMap } from "../../../../Logic/nodes/logicConfigMap.ts";
import { createBindMap, removeBindMap } from "./bindNodeMappingLogic.ts";
import { INs } from "../../../../store/slice/nodeSlice.ts";

export const ViewMappingForm = memo(() => {
  const layerViewNode = useFilterViewNode();
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  const defaultMappingViewNode = String(
    genLogicConfigMap().configInfo.get(logicState.target[0])?.viewMapInfo
      ?.viewNodeId
  );
  const [mappingViewNode, setMappingViewNode] = useState(
    defaultMappingViewNode
  );

  const onHandleInsertData = useCallback(
    (key: Selection) => {
      setMappingViewNode([...key][0] as string);
      if ([...key][0]) {
        createBindMap([...key][0] as string, logicState.target[0]);
      } else {
        removeBindMap(logicState.target[0]);
      }
      console.log(
        genLogicConfigMap(),
        key,
        NodesState.list[[...key][0]],
        "genLogicConfigMap()"
      );
      genLogicConfigMap().configInfo.set(logicState.target[0], {
        viewMapInfo: {
          viewNodeId: [...key][0] as string,
          data: NodesState.list[[...key][0]],
        },
      });
    },
    [NodesState.list, logicState.target]
  );

  return (
    <>
      <div>
        <small>选择组件(相同图层)</small>
        <Select
          selectedKeys={[mappingViewNode]}
          placeholder={"选中映射组件"}
          aria-label={"svie"}
          labelPlacement={"outside-left"}
          className="max-w-xs"
          onSelectionChange={(key) => {
            onHandleInsertData(key);
          }}
        >
          {layerViewNode.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.alias}
            </SelectItem>
          ))}
        </Select>
      </div>
    </>
  );
});
