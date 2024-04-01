import { createSingleInstance } from "../comp/createSingleInstance.ts";

const portEdgeMap = () => {
  const portEdge = new Map<string, Set<string>>();
  return {
    portEdge,
  };
};

export const getPortEdgeMap = createSingleInstance(portEdgeMap);

export const createPEM = (port: string, edgeTag: string) => {
  if (!getPortEdgeMap().portEdge.has(port)) {
    getPortEdgeMap().portEdge.set(port, new Set<string>());
  }
  getPortEdgeMap().portEdge.get(port)?.add(edgeTag);
};
export const removePEM = (port: string, edgeTag: string) => {
  getPortEdgeMap().portEdge.get(port)?.delete(edgeTag);
};
export const findPEM = (port: string) => {
  return getPortEdgeMap().portEdge.get(port);
};
