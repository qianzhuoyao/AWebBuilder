import { useEffect, useState } from "react";
import { MAIN_CONTAINER } from "../contant";

export const useAutoHeight = () => {
  const [codeContainerHeight, setCodeContainerHeight] = useState(0);

  useEffect(() => {
    const MAIN = document.getElementById(MAIN_CONTAINER);
    if (MAIN) {
      setCodeContainerHeight(MAIN.getBoundingClientRect().height);
    }
  }, []);
  return codeContainerHeight;
};
