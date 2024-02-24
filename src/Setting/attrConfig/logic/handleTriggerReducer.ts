import { createContext } from 'react';
import { IStage } from '../../../comp/msg.tsx';


interface IInitState {
  stages: IStage[];
}

export const htInitialState: IInitState = {
  stages: [],

};

interface IAction {
  type: 'updateStage';
  payload: IStage[];
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
