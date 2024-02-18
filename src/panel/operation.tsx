import { useDispatch, useSelector } from 'react-redux';
import { IPs } from '../store/slice/panelSlice';

import { memo, useCallback, useEffect, useRef } from 'react';
import Moveable from 'react-moveable';
import Selecto from 'react-selecto';
import {
  INs,
  IViewNode,
  updatePosition,
  updateSize,
  updateTargets,
} from '../store/slice/nodeSlice';
import { ATTR_TAG, Node, SCENE } from '../contant';
import { BaseChart } from '../node/chart';
import { useSceneContext } from '../menu/context';

const Temp = memo(({ id, isTemp }: { id: string; isTemp?: boolean }) => {


  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });

  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  console.log(id, NodesState, PanelState, 'id[p-d-dd-d-d-d-');
  if (NodesState.list[id].classify === 'chart') {
    return (
      <BaseChart
        type={NodesState.list[id].instance.type}
        width={isTemp ? 205 : NodesState.list[id].w / PanelState.tickUnit}
        height={isTemp ? 100 : NodesState.list[id].h / PanelState.tickUnit}
        options={NodesState.list[id].instance.option}
      ></BaseChart>
    );
  }

  return <></>;
});

export const NodeSlot = memo(
  ({ node, isTemp }: { node: IViewNode; isTemp: boolean }) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const { PanelState, NodesState } = useSelector((state: { panelSlice: IPs, viewNodesSlice: INs }) => {
      return {
        PanelState: state.panelSlice,
        NodesState: state.viewNodesSlice,
      };
    });

    // const PanelState = useSelector((state: { panelSlice: IPs }) => {
    //   return state.panelSlice;
    // });
    // const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    //   return state.viewNodesSlice;
    // });
    const { view, show } = useSceneContext();
    useEffect(() => {
      if (!nodeRef.current) {
        return;
      }
      [...nodeRef.current.getElementsByTagName('*')].forEach((ele) => {
        ele.setAttribute(ATTR_TAG, Node);
      });
    }, [NodesState]);

    const onHandleSelectedCurrent = useCallback(() => {
      //如果不是模板 就选中，否则映射至对应组件

      if (isTemp) {
        const mapNode = document.getElementById(node.id);
        console.log(mapNode, 'mapNode');
        dispatch(updateTargets([node.id]));
      } else {
        dispatch(updateTargets([nodeRef.current?.id]));
      }
    }, [dispatch, isTemp, node.id]);

    console.log(node, 'node-snode');
    return (
      <div
        ref={nodeRef}
        id={isTemp ? node.id + '-Map' : node.id}
        className={isTemp ? '' : 'absolute target'}
        onClick={onHandleSelectedCurrent}
        onContextMenu={(e) => {
          show({
            event: e,
            props: node,
          });
        }}
        style={
          isTemp
            ? {
              width: '100%',
              height: '100%',
            }
            : {
              left: node.x / PanelState.tickUnit + 'px',
              top: node.y / PanelState.tickUnit + 'px',
              width: node.w / PanelState.tickUnit + 'px',
              height: node.h / PanelState.tickUnit + 'px',
            }
        }
      >
        <Temp id={node.id} isTemp={isTemp}></Temp>
        {view(
          ['a', '2'].map((value) => {
            return <div key={value}>{value}</div>;
          }),
        )}
      </div>
    );
  },
);

const NodeContainer = memo(() => {
  const moveableRef = useRef<Moveable>(null);
  const selectoRef = useRef<Selecto>(null);

  const dispatch = useDispatch();

  const PanelState = useSelector((state: { panelSlice: IPs, viewNodesSlice: INs }) => {
    return state.panelSlice;
  });


  const NodesState = useSelector((state: { panelSlice: IPs, viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });

  // const PanelState = useSelector((state: { panelSlice: IPs }) => {
  //   return state.panelSlice;
  // });
  // const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
  //   return state.viewNodesSlice;
  // });


  useEffect(() => {
    const box = moveableRef.current?.getControlBoxElement();
    if (box) {
      box.style.zIndex = '9';
    }
  }, []);

  return (
    <>
      <Moveable
        ref={moveableRef}
        origin={false}
        keepRatio={false}
        target={NodesState.targets.map((id) => document.getElementById(id))}
        draggable={true}
        resizable={true}
        scalable={true}
        rotatable={true}
        onClickGroup={(e) => {
          selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
        }}
        onRotateEnd={e => {
          console.log(e, 'eeeonRotateEndeeee');
        }}
        onRender={(e) => {
          e.target.style.cssText += e.cssText;
        }}
        onResizeEnd={(e) => {
          dispatch(
            updateSize({
              id: e.target.id,
              w: parseFloat(e.target.style.width) * PanelState.tickUnit,
              h: parseFloat(e.target.style.height) * PanelState.tickUnit,
            }),
          );
        }}
        onDragEnd={(e) => {
          console.log(e, 'e-e-e-e-e-e-ecc');
          dispatch(
            updatePosition({
              id: e.target.id,
              x: parseFloat(e.target.style.left) * PanelState.tickUnit,
              y: parseFloat(e.target.style.top) * PanelState.tickUnit,
            }),
          );
        }}
        onRenderGroup={(e) => {
          e.events.forEach((ev) => {
            ev.target.style.cssText += ev.cssText;
          });
        }}
      />
      {PanelState.isSelection && (
        <Selecto
          ref={selectoRef}
          dragContainer={'.elements'}
          selectableTargets={['.target']}
          hitRate={0}
          selectByClick={true}
          selectFromInside={false}
          toggleContinueSelect={['shift']}
          ratio={0}
          keyContainer={window}
          onDragStart={(e) => {
            const target = e.inputEvent.target;
            if (
              moveableRef.current!.isMoveableElement(target) ||
              NodesState.targets
                .map((id) => {
                  return document.getElementById(id);
                })!
                .some((t) => t === target || t?.contains(target))
            ) {
              e.stop();
            }
          }}
          onSelectEnd={(e) => {
            setTimeout(() => {
              [...document.querySelectorAll('.moveable-area')].forEach(
                (node) => {
                  node.setAttribute(ATTR_TAG, Node);
                },
              );
            }, 0);
            if (e.isDragStartEnd) {
              e.inputEvent.preventDefault();
              moveableRef.current!.waitToChangeTarget().then(() => {
                moveableRef.current!.dragStart(e.inputEvent);
              });
            }
            dispatch(updateTargets(e.selected.map((node) => node.id)));
          }}
        />
      )}
      <div className="empty elements"></div>
      <div className="relative w-full h-full elements">
        {[...Object.values(NodesState.list)].map((node) => {
          return <NodeSlot key={node.id} node={node} isTemp={false}></NodeSlot>;
        })}
      </div>
    </>
  );
});

export const AScene = memo(() => {
  const SCENE_REF = useRef<HTMLDivElement>(null);
  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });

  return (
    <>
      <div
        className="absolute w-[calc(100%_-_40px)] h-[calc(100%_-_40px)]"
        style={{
          left: '30px',
          top: '30px',
        }}
      >
        <div id="container" className="relative w-full h-full overflow-hidden">
          <div
            ref={SCENE_REF}
            id={SCENE}
            className="absolute bg-[#232324] overflow-hidden"
            style={{
              left: PanelState.panelLeft - PanelState.rulerMinX + 'px',
              top: PanelState.panelTop - PanelState.rulerMinY + 'px',
              width: PanelState.panelWidth / PanelState.tickUnit + 'px',
              height: PanelState.panelHeight / PanelState.tickUnit + 'px',
            }}
          >
            <NodeContainer></NodeContainer>
          </div>
        </div>
      </div>
    </>
  );
});
