import { createSingleInstance } from "../comp/createSingleInstance.ts";

type nodePortId = string;
type nodeId = string;

interface IPort {
  type: "out" | "in";
  tag: number;
  portType: string;
  portName: string;
  pointStatus: 0 | 1 | 2;
  id: string;
}

const portStatus = () => {
  const status = new Map<nodePortId, IPort>();
  const nodePortMap = new Map<nodeId, Set<nodePortId>>();
  return {
    nodePortMap,
    status,
  };
};
export const getPortStatus = createSingleInstance(portStatus);

export const addPortNodeMap = (nodeId: string, portId: string) => {
  if (!getPortStatus().nodePortMap.has(nodeId)) {
    getPortStatus().nodePortMap.set(nodeId, new Set<nodePortId>());
  }
  getPortStatus().nodePortMap.get(nodeId)?.add(portId);
};

export const removePortNodeMap = (nodeId: string, portId: string) => {
  if (getPortStatus().nodePortMap.has(nodeId)) {
    getPortStatus().nodePortMap.get(nodeId)?.delete(portId);
  }
};

export const getPortNodeMap = (nodeId: string) => {
  return getPortStatus().nodePortMap.get(nodeId);
};

export const findPortInfo = (portId: string) => {
  return getPortStatus().status.get(portId);
};

export const updateConnectStatus = (portId: string, status: 0 | 1 | 2) => {
  if (getPortStatus().status.get(portId)) {
    (getPortStatus().status.get(portId) as IPort).pointStatus = status;
  }
};
