import { createContext } from "react";

interface IInitState<T> {
  stages: T[];
}

export const htInitialState: IInitState<unknown> = {
  stages: [],
};

interface IAction<T> {
  type: "updateStage";
  payload: T[];
}

export const HtContext = createContext<
  IInitState<unknown> & {
    clear?: () => void;
  }
>(htInitialState);

export const htReducer = <T>(state: IInitState<T>, action: IAction<T>) => {
  const { type, payload } = action;

  switch (type) {
    case "updateStage":
      return {
        ...state,
        stages: payload,
      };
    default:
      throw new Error(`No case for type ${type} found in RemoteReducer.`);
  }
};
