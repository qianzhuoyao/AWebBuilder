import { createContext } from 'react';



interface IInitState {
  stages: any[];
}

export const htInitialState: IInitState = {
  stages: [],

};

interface IAction {
  type: 'updateStage';
  payload: any[];
}


export const HtContext = createContext<IInitState & {
  clear?: () => void
}>(htInitialState);

export const htReducer = (state: IInitState, action: IAction) => {
  const { type, payload } = action;

  switch (type) {
    // Switch cases here...
    case 'updateStage':
      return {
        ...state,
        stages: payload,
      };
    default:
      throw new Error(`No case for type ${type} found in RemoteReducer.`);
  }
};
