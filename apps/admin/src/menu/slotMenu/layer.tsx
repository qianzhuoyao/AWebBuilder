import { ALayoutInstance } from 'AWebBuilder';
import { useEffect, useState } from 'react';

export const LayerMenu = () => {
  const [layerType, setLayerType] = useState<1 | 2>(1);
  const [sceneDetailOpen, setSceneDetailOpen] = useState(false);
  const [currentScene, setCurrentScene] = useState('');
  const [menuSelected, setMenuSelected] = useState<string[]>([]);
  const [sceneWidget, setSceneWidget] = useState<any[]>([]);
  const [scene, setScene] = useState<{ id: string; name: string }[]>(
    ALayoutInstance.getLayer().map((layer) => ({
      id: layer.id,
      name: layer.getName(),
    }))
  );
  useEffect(() => {
    setCurrentScene(scene[0].id);
    ALayoutInstance.getSlots().on('click', (e) => {
      e && setMenuSelected([e.getId()]);
    });
    ALayoutInstance.getSlots().on('mouseDownEmpty', (e) => {
      setMenuSelected([]);
    });
    ALayoutInstance.onSubscribeSlots({
      create: (node) => {
        setSceneWidget((curr) => {
          return curr.concat([node]);
        });
      },
    });
    ALayoutInstance.onCurrentLayerChangeSubscribe((layer) => {
      console.log(layer, [...(layer?.getNodes() || [])], 'layers');
      setSceneWidget(() => {
        return [...(layer?.getNodes() || [])]?.map(([_, node]) => {
          return node;
        });
      });
    });
  }, []);
  return (
    <div
      style={{
        left: '0px',
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'scroll',
        zIndex: 2,
      }}
    >
      {/* 按钮 */}
      <ul className="menu menu-lg menu-vertical lg:menu-horizontal bg-base-200 w-full border-b border-bg-n">
        <li className={layerType === 1 ? 'bg-neutral bg-opacity-10 rounded-md' : ''}>
          <a>图层</a>
        </li>
      </ul>
      <div className="border-b border-bg-n">
        {/* 导航 */}
        <div className="navbar bg-base-200">
          <div className="flex-1">
            <a
              className="btn btn-ghost text-md"
              onClick={() => {
                setSceneDetailOpen(!sceneDetailOpen);
              }}
            >
              scene
              {!sceneDetailOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="_selectIcon_19zeu_59"
                >
                  <path
                    d="M7 5L10 8L7 11"
                    stroke="#989898"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="_selectIcon_19zeu_59"
                >
                  <path
                    d="M11 6.5L8 9.5L5 6.5"
                    stroke="#989898"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              )}
            </a>
          </div>
          <div className="flex-none">
            <ul className="px-1 flex">
              <li>
                <button role="button" className="btn btn-circle btn-ghost">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="currentColor"
                      d="M13 13h8v6q0 .825-.587 1.413T19 21h-6zm0-2V3h6q.825 0 1.413.588T21 5v6zm-2 0H3V5q0-.825.588-1.412T5 3h6zm0 2v8H5q-.825 0-1.412-.587T3 19v-6z"
                    />
                  </svg>
                </button>
              </li>
              <li>
                <div className="dropdown dropdown-bottom dropdown-end">
                  <button tabIndex={0} role="button" className="btn btn-circle btn-ghost">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M440 240H272V72h-32v168H72v32h168v168h32V272h168z"
                      />
                    </svg>
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-1"
                  >
                    <li>
                      <a
                        onClick={() => {
                          const currentLayer = ALayoutInstance.addLayer();
                          ALayoutInstance.setCurrentLayer(currentLayer.id);
                          const newScene = ALayoutInstance.getLayer().map((layer) => ({
                            id: layer.id,
                            name: layer.getName(),
                          }));
                          setSceneDetailOpen(true);
                          setScene(newScene);
                          setCurrentScene(currentLayer.id);
                        }}
                      >
                        新建图层
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
        {/* 面板详情 */}
        {sceneDetailOpen && (
          <ul className="menu bg-base-200 w-full">
            {scene.map((sn, index) => {
              return (
                <li
                  key={sn.id}
                  className={
                    currentScene === sn.id ? 'bg-base-300 rounded-md flex m-1' : 'flex m-1'
                  }
                >
                  <a
                    className="justify-between flex w-full"
                    onClick={() => {
                      setCurrentScene(sn.id);
                      ALayoutInstance.setCurrentLayer(sn.id);
                    }}
                  >
                    <span className="justify-start flex">
                      {currentScene === sn.id && (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 36 36"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1"
                        >
                          <path
                            fill="currentColor"
                            d="M13.72 27.69L3.29 17.27a1 1 0 0 1 1.41-1.41l9 9L31.29 7.29A1 1 0 0 1 32.7 8.7Z"
                            className="clr-i-outline clr-i-outline-path-1"
                          />
                          <path fill="none" d="M0 0h36v36H0z" />
                        </svg>
                      )}
                      {sn.name}-{index}
                    </span>
                    {index === 0 && (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="currentColor"
                          d="M18.672 11H17v6c0 .445-.194 1-1 1h-4v-6H8v6H4c-.806 0-1-.555-1-1v-6H1.328c-.598 0-.47-.324-.06-.748L9.292 2.22c.195-.202.451-.302.708-.312c.257.01.513.109.708.312l8.023 8.031c.411.425.539.749-.059.749"
                        />
                      </svg>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ul
        className="menu menu-md bg-base-200 w-full"
        style={{
          height: '100%',
        }}
      >
        {sceneWidget?.map((node, index) => {
          return (
            <li
              key={index}
              className="ellipsis-text"
              style={{
                background: menuSelected.includes(node.getId()) ? 'red' : '',
              }}
            >
              <a
                className="ellipsis-text"
                onClick={() => {
                  ALayoutInstance.getCurrentLayer()?.selectNode(node.getInfo().id);
                }}
              >
                {node.getInfo().type}-{index}
              </a>
            </li>
          );
        })}
        {/* <li className="ellipsis-text">
          <a className="ellipsis-text">lg item 112e12e1212e12e12e12e11111111111111</a>
        </li>
        <li className="ellipsis-text">
          <a className="ellipsis-text">lg item 2</a>
        </li> */}
      </ul>
    </div>
  );
};
