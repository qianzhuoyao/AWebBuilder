import { createSlice } from '@reduxjs/toolkit';
import { getWDGraph } from '../../DirGraph/weightedDirectedGraph.ts';

export interface ILogicNode {
  id: string;
  shape: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string;
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
export const { updateLogicContentImageShowType, addLogicNode } = logicSlice.actions;

export default logicSlice.reducer;
