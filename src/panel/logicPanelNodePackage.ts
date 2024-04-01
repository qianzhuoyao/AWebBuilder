import { createSingleInstance } from "../comp/createSingleInstance.ts";

interface IPackage {}

const nodePackage = () => {
  const pack: Map<string, IPackage> = new Map();
  return {
    pack,
  };
};

export const getNodePackage = createSingleInstance(nodePackage);
