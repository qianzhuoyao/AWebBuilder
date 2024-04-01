import { ReplaySubject } from "rxjs";
import { createSingleInstance } from "../comp/createSingleInstance.ts";

const chart = () => {
  const observable = new ReplaySubject();
  return {
    observable,
  };
};
export const getChartEmit = createSingleInstance(chart);
