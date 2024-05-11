import { SHOT_IMAGE_CONTAINER } from "../contant";
import html2canvas from 'html2canvas'


export const toImage = (): Promise<string> => {
  return new Promise((resolve, rej) => {
    const canvasDom = document.createElement('canvas')
    const node = document.getElementById(SHOT_IMAGE_CONTAINER);

    if (node) {
      canvasDom.width = parseInt(window.getComputedStyle(node).width, 10)
      canvasDom.height = parseInt(window.getComputedStyle(node).height, 10)
      html2canvas(node, { canvas: canvasDom, useCORS: true })
        .then(function (src) {
          resolve(src.toDataURL());
        })
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
          rej(error);
        });
    }
  });
};
