type Vertex<V> = {
  vertex: V;
  outDegree: V[] | null | undefined;
  inDegree: V[] | null | undefined;
};

type  IEdgeMessage = Record<string, string>

type Edge<T, M> = {
  target: T;
  targetPort: T;
  sourcePort: T;
  source: T;
  message: M
  weight: number;
};

type Path<T, M> = {
  edges: Edge<T, M>[];
};


/**
 * 加权有向图
 * T 顶点类型
 * M 边的传递的上下文
 * 加权有向图
 * const graph = new WeightedDirectedGraph<string>();
 * graph.addEdge('A', 'B', 2);
 * graph.addEdge('A', 'C', 3);
 * graph.addEdge('B', 'C', 1);
 *
 * console.log(graph.hasEdge('A', 'B')); // true
 * console.log(graph.hasEdge('B', 'A')); // false
 */
export default class WeightedDirectedGraph<T, M> {
  private adjacencyList: Map<T, Edge<T, M>[]>;
  private degree: Map<T, Vertex<T>>;
  private static instance: WeightedDirectedGraph<unknown, unknown>;

  public static getInstance() {
    if (!WeightedDirectedGraph.instance) {
      WeightedDirectedGraph.instance = new WeightedDirectedGraph();
    }
    return WeightedDirectedGraph.instance;
  }

  constructor() {
    this.adjacencyList = new Map();
    this.degree = new Map();
  }


  /**
   * 添加顶点
   * @param vertex
   */
  addVertex(vertex: T) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }


  removeVertex(vertex: T) {
    this.degree.delete(vertex);
    this.adjacencyList.delete(vertex);
  }

  /**
   * dfs
   * 路径集合按照降序排列
   * 遍历过程中记录了最近一次的路径集合 lastPath。当遍历完成后，如果存在路径集合，则返回该集合；否则返回空数组。
   * 如果存在环，则返回进入环前的路径集合
   * 如果to 不传 则查找至最后一个点
   * @param from
   * @param to
   */
  findAllPaths(from: T, to?: T): Path<T, M>[] {
    const visited: Map<T, boolean> = new Map();
    const paths: Path<T, M>[] = [];

    /**
     * dfs search
     * @param current
     * @param target
     * @param path
     */
    const dfs = (current: T, target: T | undefined, path: Path<T, M>): void => {
      if (current === target) {
        paths.push({ ...path });
        return;
      }
      if (!this.getEdges(current).length && target === undefined) {
        paths.push({ ...path });
        return;
      }
      visited.set(current, true);
      const edges = this.adjacencyList.get(current);
      if (edges) {
        for (const edge of edges) {
          if (!visited.get(edge.target)) {
            dfs(edge.target, target, { ...path, edges: [...path.edges, edge] });
          }
        }
      }
      visited.set(current, false);
    };

    dfs(from, to, { edges: [] });

    return paths.sort((a, b) => {
      const sumA = a.edges.reduce((acc, curr) => acc + curr.weight, 0);
      const sumB = b.edges.reduce((acc, curr) => acc + curr.weight, 0);
      return sumB - sumA;
    });
  }

  /**
   * 获取某顶点入度集合
   */
  getInDegree(source: T) {
    return [...this.degree.values()].filter(vec => {
      return vec.outDegree?.includes(source);
    }).map(vec => vec.vertex);
  }

  /**
   * 获取某顶点出度集合
   */
  getOutDegree(source: T) {
    return [...this.degree.values()].filter(vec => {
      return vec.inDegree?.includes(source);
    }).map(vec => vec.vertex);
  }

  /**
   * 计算某条路径，的总权重
   * @param path
   */

  calculateTotalWeight<T, >(path: Path<T, M>): number {
    let totalWeight = 0;
    for (const edge of path.edges) {
      totalWeight += edge.weight;
    }
    return totalWeight;
  }

  /**
   * 是否存在边
   * @param source
   * @param target
   */
  hasEdge(source: T, target: T) {
    const edges = this.adjacencyList.get(source);
    return !!edges && edges.some((edge) => edge.target === target);
  }


  private addDegree(source: T, target: T) {
    if (!this.degree.has(source)) {
      this.degree.set(source, {
        outDegree: [],
        vertex: source,
        inDegree: [],
      });
    }
    if (!this.degree.has(target)) {
      this.degree.set(target, {
        outDegree: [],
        vertex: target,
        inDegree: [],
      });
    }
    this.degree.get(source)?.outDegree?.push(target);
    this.degree.get(target)?.inDegree?.push(source);
  }

  /**
   * 添加边
   * @param source
   * @param target
   * @param message
   * @param weight
   * @param sport
   * @param tport
   */
  addEdge(source: T, target: T, message: M, weight: number, sport: T, tport: T) {

    if (this.hasEdge(source, target)) {
      throw new Error('边已经存在，如要修改边信息 请使用updateEdge方法');
    }

    if (!this.adjacencyList.has(source)) {
      this.addVertex(source);
    }
    if (!this.adjacencyList.has(target)) {
      this.addVertex(target);
    }
    this.addDegree(source, target);
    this.adjacencyList.get(source)?.push({
      source, target, sourcePort: sport,
      weight, message, targetPort: tport,
    });
  }

  /**
   * 删除边
   * @param source
   * @param target
   */
  removeEdge(source: T, target: T) {
    const edges = this.adjacencyList.get(source);
    if (edges) {
      this.degree.set(source, {
        ...this.degree.get(source),
        outDegree: this.degree.get(source)?.outDegree?.filter(d => d !== target),
      } as Vertex<T>);

      this.degree.set(target, {
        ...this.degree.get(target),
        inDegree: this.degree.get(target)?.inDegree?.filter(d => d !== source),
      } as Vertex<T>);
      console.log( this.degree,'sss this.degree');
      this.adjacencyList.set(
        source,
        edges.filter((edge) => edge.target !== target),
      );
    }
  }

  /**
   * 更新边,如果边不存在，则不操作
   * @param newEdge
   */
  updateEdge(newEdge: {
    from: T, to: T, newWeight?: number, message?: M
  }): void {
    const { from, to, newWeight, message } = newEdge;
    const edges = this.adjacencyList.get(from);
    if (!edges) {
      return;
    }
    const edge = edges.find(edge => edge.target === to);
    if (edge) {
      if (newWeight) {
        edge.weight = newWeight;
      }
      if (message) {
        edge.message = message;
      }
    }
  }


  /**
   * 获取所有顶点
   */
  getVertices() {
    return Array.from(this.adjacencyList.keys());
  }

  /**
   * 获取所有边
   */

  getEdges(vertex: T) {
    return this.adjacencyList.get(vertex) || [];
  }
}

const WdClass = WeightedDirectedGraph<string, IEdgeMessage>;

const instance = WdClass.getInstance() as WeightedDirectedGraph<string, IEdgeMessage>;

export const getWDGraph = (): WeightedDirectedGraph<string, IEdgeMessage> => {
  return instance;
};