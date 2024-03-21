import { createSingleInstance } from '../comp/createSingleInstance.ts';

const portEdgeMap = () => {
  const portEdge = new Map<string, Set<string>>();
  return {
    portEdge,
  };
};

export const getPortEdgeMap = createSingleInstance(portEdgeMap);

export const createPEM = (port: string, edgetag: string) => {
  if (!getPortEdgeMap().portEdge.has(port)) {
    getPortEdgeMap().portEdge.set(port, new Set<string>());
  }
  getPortEdgeMap().portEdge.get(port)?.add(edgetag);
};
export const removePEM = (port: string, edgetag: string) => {
  getPortEdgeMap().portEdge.get(port)?.delete(edgetag);
};
export const findPEM = (port: string) => {
  return getPortEdgeMap().portEdge.get(port)
};