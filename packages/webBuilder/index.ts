import { keyDown, keyUp } from './eventStream/keyEvent';
import { ALayoutInstance, ALayoutAutoFill,setProvider } from './Layout/layout';

const event = {
  keyDown,
  keyUp,
};
export { ALayoutInstance, ALayoutAutoFill,setProvider, event };
