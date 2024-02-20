import React, { useLayoutEffect } from 'react';
import gsap from 'gsap';

interface IGsp {
  show: boolean;
  gspDom: HTMLDivElement;
  visibleStyle: React.CSSProperties;
  hiddenStyle: React.CSSProperties;
}

export const useGsp = (gspParams: IGsp) => {
  const {
    show,
    gspDom,
    visibleStyle,
    hiddenStyle,
  } = gspParams;

  useLayoutEffect(() => {
    if (!show) {
      gsap.to(gspDom, {
        ...visibleStyle,
        duration: 0.1,
        ease: 'none',
      });
    } else {
      gsap.to(gspDom, {
        ...hiddenStyle,
        duration: 0.1,
        ease: 'none',
      });
    }
  }, [show]);

  return null;
};