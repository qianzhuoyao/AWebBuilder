import { FC, useEffect } from 'react';
import { Panel } from './panel';
import { SlotMenu } from '../menu/slotMenu';
import { singletonDController } from './DOMController';

/**
 * adrag24 使用的tailwindcss
 * 使用前需要安装好tailwindcss 与 daisyui
 */
interface IALayout {
  width: number;
  height: number;
  children: React.ReactNode;
}

/**
 * 关于位置最好多补个 与 unitSize
 * 自动按照容器大小构建基于unitSize 的网格
 *
 */
export const ALayoutInstance = new Panel({
  coordinateSystemConfig: {
    width: 200,
    height: 300,
    unitSize: 40,
  },
});

export const setProvider = (p: HTMLElement) => {
  ALayoutInstance.setProvider(p);
};

export const ALayoutAutoFill = () => {
  ALayoutInstance.getCoordinateSystemLayer().setCoordinateSystemSize({
    width: window.innerWidth,
    height: window.innerHeight,
  });
};
