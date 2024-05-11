import { memo, useCallback, useState } from "react";
import { Select, SelectItem, Selection } from "@nextui-org/react";
import { useFilterViewNode } from "../../../../panel/useFilter.tsx";
import { genLogicConfigMap } from "../../../../Logic/nodes/logicConfigMap.ts";
import { createBindMap, removeBindMap } from "./bindNodeMappingLogic.ts";
import { useTakeNodeData } from "../../../../comp/useTakeNodeData.tsx";
import { useTakeLogicData } from "../../../../comp/useTakeLogicData.tsx";

export const ViewMappingForm = memo(() => {
  const layerViewNode = useFilterViewNode();
  const logicState = useTakeLogicData()
  const NodesState = useTakeNodeData()
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
