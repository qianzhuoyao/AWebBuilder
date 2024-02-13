import { createSlice } from '@reduxjs/toolkit';
import { getWDGraph } from '../../DirGraph/weightedDirectedGraph.ts';
import { ILogicType } from './nodeSlice.ts';


export interface ILogicNode {
  id: string;
  typeId: ILogicType;
  shape: string;

  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string;
  /**
   * 对端句柄

   */
  ports: {
    type: 'in' | 'out',
    tag: number,
    pointStatus: 0|1|2; // 0 无连接 1 信号存在时异常或者无信号 2 信号存在时正常
  }[];
}


export interface ILogicEdge {
  from: string;
  to: string;
  weight: number;
}

export interface ILs {
  //0 大预览 1 小缩略
  contentImageShowType: 0 | 1;
  logicNodes: Record<string, ILogicNode>;
  logicEdges: ILogicEdge[];
}

export const logicSlice = createSlice({
  name: 'logic',
  initialState: {
    logicEdges: [],
    logicNodes: {},
    contentImageShowType: 0,
  } as ILs,
  reducers: {
    addLogicEdge: (state, action) => {
      const { from, to, weight } = action.payload;
      if (typeof from === 'string' && typeof to === 'string' && typeof weight === 'number') {
        const edge: ILogicEdge = {
          from,
          to,
          weight,
        };
        state.logicEdges.push(edge);
        getWDGraph().addEdge(from, to, {}, weight);
      } else {
        throw TypeError('type error');
      }
    },

    updateLogicPortsNode: (state, action) => {
      const { id, connected, tag ,portType} = action.payload;
      console.log(tag,'tagtagtagtag');
      (state.logicNodes as Record<string, ILogicNode>)[id] =
        {
          ...(state.logicNodes as Record<string, ILogicNode>)[id]
          , ...{
            ...action.payload, ports: (state.logicNodes as Record<string, ILogicNode>)[id].ports.map(port => {
              if (port.tag === tag && port.type===portType) {
                return {
                  ...port,
                  pointStatus: connected,
                };
              } else {
                return port;
              }
            }),
          },
        };

    },

    updateLogicNode: (state, action) => {
      const { id } = action.payload;
      (state.logicNodes as Record<string, ILogicNode>)[id] =
        { ...(state.logicNodes as Record<string, ILogicNode>)[id], ...action.payload };

    },

    addLogicNode: (state, action) => {

      (state.logicNodes as Record<string, ILogicNode>)[action.payload.id] =
        action.payload;
      //添加节点，与logicNodes 区分开是为了做redo undo
      getWDGraph().addVertex(action.payload.id);
    },
    updateLogicContentImageShowType: (state, action) => {
      state.contentImageShowType = action.payload;
    },
  },
});
// 每个 case reducer 函数会生成对应的 Action creators
export const { updateLogicPortsNode,updateLogicNode, addLogicEdge, updateLogicContentImageShowType, addLogicNode } = logicSlice.actions;

export default logicSlice.reducer;
