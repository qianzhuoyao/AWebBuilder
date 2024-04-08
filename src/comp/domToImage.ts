import domtoimage from "dom-to-image";
import { PANEL_MAIN_BG } from "../contant";

export const toImage = () => {
  return new Promise((resolve, rej) => {
    const node = document.getElementById(PANEL_MAIN_BG);
    if (node) {
      domtoimage
        .toPng(node)
        .then(function (dataUrl) {
          resolve(dataUrl);
        })
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
          rej(error);
        });
    }
  });
};
