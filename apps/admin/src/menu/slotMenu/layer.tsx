import { ALayoutInstance } from 'AWebBuilder';
import { useEffect, useState } from 'react';

export const LayerMenu = () => {
  const [layerType, setLayerType] = useState<1 | 2>(1);
  const [sceneDetailOpen, setSceneDetailOpen] = useState(false);
  const [currentScene, setCurrentScene] = useState('');
  const [scene, setScene] = useState<{ id: string; name: string }[]>(
    ALayoutInstance.getLayer().map((layer) => ({
      id: layer.id,
      name: layer.getName(),
    }))
  );
  useEffect(() => {
    setCurrentScene(scene[0].id);
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

      {/* 导航 */}
      <div className="navbar bg-base-200">
        <div className="flex-1">
          <a
            className="btn btn-ghost text-md"
            onClick={() => {
              setSceneDetailOpen(!sceneDetailOpen);
              console.log(scene, 'scscsscsc');
            }}
          >
            scene
          </a>
        </div>
        <div className="flex-none">
          <ul className="px-1 flex">
            <li>
              <button role="button" className="btn btn-circle btn-ghost">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                        ALayoutInstance.addLayer();
                        setScene(
                          ALayoutInstance.getLayer().map((layer) => ({
                            id: layer.id,
                            name: layer.getName(),
                          }))
                        );
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
              <li key={sn.id} className={currentScene === sn.id ? 'bg-base-300 rounded-md' : ''}>
                <a
                  onClick={() => {
                    ALayoutInstance.changeLayer(sn.id);
                    setCurrentScene(sn.id);
                  }}
                >
                  {sn.name}-{index}
                </a>
              </li>
            );
          })}
        </ul>
      )}
      <ul
        className="menu menu-lg bg-base-200 w-56"
        style={{
          width: '320px',
          height: '100%',
        }}
      >
        <li className="ellipsis-text">
          <a className="ellipsis-text">lg item 112e12e1212e12e12e12e11111111111111</a>
        </li>
        <li className="ellipsis-text">
          <a className="ellipsis-text">lg item 2</a>
        </li>
      </ul>
    </div>
  );
};
