import { AInput } from "../../../comp/AInput.tsx";
import { useDispatch, useSelector } from "react-redux";
import {
  INs,
  updateAlias,
  updatePosition,
  updateRotate,
  updateSize,
  updateZ,
} from "../../../store/slice/nodeSlice.ts";
import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { Chip } from "@nextui-org/react";
import { hasBindViewMap } from "../logic/viewMapping/bindNodeMappingLogic.ts";
import {
  emitBlockSetPosition,
  emitBlockSetRotate,
  emitBlockSetSize,
  emitBlockSetZIndex,
} from "../../../emit/emitBlock.ts";
import { useTakeNodeData } from "../../../comp/useTakeNodeData.tsx";
import { useTakePanel } from "../../../comp/useTakeStore.tsx";

export const DefaultViewNodeConfigForm = () => {
  const PanelState = useTakePanel()
  const dispatch = useDispatch();
  const NodesState = useTakeNodeData()
  const isBind = useMemo(() => {
    return hasBindViewMap(NodesState.list[NodesState.targets[0]].id);
  }, [NodesState.list, NodesState.targets]);

  const updateNodeAlias = useCallback(
    (alias: string) => {
      if (Object.values(NodesState.list).some((node) => node.alias === alias)) {
        toast.error("别名不可以重复");
      } else {
        dispatch(
          updateAlias({
            id: NodesState.targets[0],
            alias: alias,
          })
        );
      }
    },
    [NodesState.list, NodesState.targets, dispatch]
  );

  return (
    <>
      <div className={"flex items-center justify-between"}>
        <div className={"flex mb-1"}>
          <small>
            {NodesState.targets.length === 1
              ? "当前节点逻辑绑定状态"
              : "选中节点过多"}
          </small>
        </div>
        <div className={"flex mb-1"}>
          {isBind ? (
            <Chip variant="faded" color="success">
              已绑定
            </Chip>
          ) : (
            <Chip variant="faded" color="danger">
              未绑定
            </Chip>
          )}
        </div>
      </div>
      <div className={"flex mb-1 border-t-1 border-default-100"}>
        <small>
          {NodesState.targets.length === 1 ? "节点当前位置" : "选中节点过多"}
        </small>
      </div>
      <div className={"flex mb-1"}>
        {NodesState.targets.length === 1 ? (
          <>
            <AInput
              placeholder="x"
              className="w-[250px] mr-2"
              size="xs"
              onChange={(e) => {
                emitBlockSetPosition({
                  x: Number(e.target.value),
                  y: NodesState.list[NodesState.targets[0]].y,
                });
                dispatch(
                  updatePosition({
                    id: NodesState.targets[0],
                    x: Number(e.target.value),
                    y: NodesState.list[NodesState.targets[0]].y,
                  })
                );
              }}
              value={String(
                Math.floor(NodesState.list[NodesState.targets[0]].x)
              )}
            />
            <AInput
              placeholder="y"
              className="w-[250px] mr-2"
              size="xs"
              onChange={(e) => {
                emitBlockSetPosition({
                  x: NodesState.list[NodesState.targets[0]].x,
                  y: Number(e.target.value),
                });
                dispatch(
                  updatePosition({
                    id: NodesState.targets[0],
                    x: NodesState.list[NodesState.targets[0]].x,
                    y: Number(e.target.value),
                  })
                );
              }}
              value={String(
                Math.floor(NodesState.list[NodesState.targets[0]].y)
              )}
            />
          </>
        ) : (
          <>-</>
        )}
      </div>
      {NodesState.targets.length === 1 && (
        <div>
          <small>旋转角度</small>
          <AInput
            placeholder="rotate"
            className="w-[250px] mr-2"
            size="xs"
            onChange={(e) => {
              emitBlockSetRotate(Number(e.target.value));
              dispatch(
                updateRotate({
                  id: NodesState.targets[0],
                  rotate: Number(e.target.value),
                })
              );
            }}
            value={String(Math.floor(NodesState.list[NodesState.targets[0]].r))}
          />
          <small>{"层级(最大999,最小1)"}</small>
          <AInput
            placeholder="zIndex"
            className="w-[250px] mr-2"
            size="xs"
            onChange={(e) => {
              if (
                Number(e.target.value) &&
                Number(e.target.value) > 0 &&
                Number(e.target.value) < 999
              ) {
                emitBlockSetZIndex(
                  Number(e.target.value) || 1,
                  NodesState.targets[0]
                );
                dispatch(
                  updateZ({
                    id: NodesState.targets[0],
                    zIndex: Number(e.target.value) || 1,
                  })
                );
              } else {
                toast.error("层级异常输入");
              }
            }}
            value={String(Math.floor(NodesState.list[NodesState.targets[0]].z))}
          />
        </div>
      )}
      <div className={"flex mb-1 border-t-1 border-default-100"}>
        <small>
          {NodesState.targets.length === 1 ? "节点当前大小" : "选中节点过多"}
        </small>
      </div>

      <div className={"flex mt-1"}>
        {NodesState.targets.length === 1 ? (
          <>
            <AInput
              placeholder="width"
              className="w-[250px] mr-2"
              size="xs"
              onChange={(e) => {
                emitBlockSetSize({
                  w: Number(e.target.value),
                  h: NodesState.list[NodesState.targets[0]].h,
                });
                dispatch(
                  updateSize({
                    id: NodesState.targets[0],
                    w: Number(e.target.value),
                    h: NodesState.list[NodesState.targets[0]].h,
                  })
                );
              }}
              value={String(
                Math.floor(NodesState.list[NodesState.targets[0]].w)
              )}
            />
            <AInput
              placeholder="height"
              className="w-[250px] mr-2"
              size="xs"
              onChange={(e) => {
                emitBlockSetSize({
                  w: NodesState.list[NodesState.targets[0]].w,
                  h: Number(e.target.value),
                });
                dispatch(
                  updateSize({
                    id: NodesState.targets[0],
                    w: NodesState.list[NodesState.targets[0]].w,
                    h: Number(e.target.value),
                  })
                );
              }}
              value={String(
                Math.floor(NodesState.list[NodesState.targets[0]].h)
              )}
            />
          </>
        ) : (
          <>-</>
        )}
      </div>
      <div className={"flex my-1 border-t-1 border-default-100"}>
        <small>
          {NodesState.targets.length === 1 ? "别名" : "选中节点过多"}
        </small>
      </div>
      <div>
        <AInput
          size={"xs"}
          type="email"
          label="别名"
          value={NodesState.list[NodesState.targets[0]].alias}
          placeholder="别名"
          labelPlacement="outside"
          onChange={(e) => {
            updateNodeAlias(e.target.value);
          }}
        ></AInput>
      </div>
    </>
  );
};
