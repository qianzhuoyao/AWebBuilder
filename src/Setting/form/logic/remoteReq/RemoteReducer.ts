import { createContext } from 'react';


interface IInitState {
  request: Record<string, any>;
  response: any;
}

export const initialState: IInitState = {
  request: {},
  response: {},
};

interface IRequest {
  type: 'req',
  payload: any
}

interface IResponse {
  type: 'resp',
  payload: any
}

type IAction = IRequest | IResponse

export const TestRemoteContext = createContext(initialState);

export const TestRemoteReducer = (state: IInitState, action: IAction) => {
  const { type, payload } = action;

  switch (type) {
    // Switch cases here...
    case 'req':
      return {
        ...state,
        request: payload,
      };
    case 'resp':
      return {
        ...state,
        response: payload,
      };
    default:
      throw new Error(`No case for type ${type} found in RemoteReducer.`);
  }
};
