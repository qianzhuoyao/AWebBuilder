/**
 * slot 的构建菜单
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { ALayoutInstance } from 'AWebBuilder';

const DEFAULT_RATIO = ['1920*1080', '2560*1600', '2048*1536', '1280*1024'];

const RATIO = [2, 1, 0.5, 0.2];

const OTHER = ['矢量图形', '线条'];

export type IWidgetType = 'chart' | 'table' | 'text' | 'image';

export const SlotMenu = () => {
  const otherButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuButtonRef = useRef<HTMLInputElement | null>(null);
  const chartButtonRef = useRef<HTMLInputElement | null>(null);
  const tableButtonRef = useRef<HTMLInputElement | null>(null);
  const textButtonRef = useRef<HTMLInputElement | null>(null);
  const imageButtonRef = useRef<HTMLInputElement | null>(null);
  const operationButtonRef = useRef<HTMLInputElement | null>(null);
  const themeButtonRef = useRef<HTMLInputElement | null>(null);
  const scaleRef = useRef<HTMLInputElement | null>(null);
  const ratioRef = useRef<HTMLInputElement | null>(null);

  const transformRef = useRef<HTMLInputElement | null>(null);

  const [ratio, setRatio] = useState<string>('1920*1080');

  const [ratioFocus, setRatioFocus] = useState<boolean>(false);

  //快捷设置尺寸
  const setPanelSize = (ratio: string) => {
    const size = ratio.split('*');
    ALayoutInstance.setLoading(true);
    setTimeout(() => {
      ALayoutInstance.setLoading(false);
    }, 1000);

    ALayoutInstance.getCoordinateSystemLayer().setCoordinateSystemSize({
      width: Number(size[0]?.trim()) || 1920,
      height: Number(size[1]?.trim()) || 1080,
    });
  };

  const onResetTransform = useCallback((e) => {
    ALayoutInstance.getCoordinateSystemLayer().reSetTransform();
    setTimeout(() => {
      if (transformRef.current) {
        transformRef.current.checked = false;
      }
    }, 600);
  }, []);
  /**
   * 当前选中的nav的组件
   */
  const setCurrentNavWidget = useCallback((type: IWidgetType) => {
    const widgetOperationMap: Record<IWidgetType, () => void> = {
      chart: () => {
        if (chartButtonRef.current?.checked) {
          ALayoutInstance.currentWidgetWillBuilder('chart');
        } else {
          ALayoutInstance.resetCurrentWidgetWillBuilder();
        }

        if (tableButtonRef.current) {
          tableButtonRef.current.checked = false;
        }
        if (textButtonRef.current) {
          textButtonRef.current.checked = false;
        }
        if (imageButtonRef.current) {
          imageButtonRef.current.checked = false;
        }
      },
      table: () => {
        if (chartButtonRef.current?.checked) {
          ALayoutInstance.currentWidgetWillBuilder('table');
        } else {
          ALayoutInstance.resetCurrentWidgetWillBuilder();
        }
        if (chartButtonRef.current) {
          chartButtonRef.current.checked = false;
        }
        if (textButtonRef.current) {
          textButtonRef.current.checked = false;
        }
        if (imageButtonRef.current) {
          imageButtonRef.current.checked = false;
        }
      },
      text: () => {
        if (chartButtonRef.current?.checked) {
          ALayoutInstance.currentWidgetWillBuilder('text');
        } else {
          ALayoutInstance.resetCurrentWidgetWillBuilder();
        }
        if (tableButtonRef.current) {
          tableButtonRef.current.checked = false;
        }
        if (chartButtonRef.current) {
          chartButtonRef.current.checked = false;
        }
        if (imageButtonRef.current) {
          imageButtonRef.current.checked = false;
        }
      },
      image: () => {
        if (chartButtonRef.current?.checked) {
          ALayoutInstance.currentWidgetWillBuilder('image');
        } else {
          ALayoutInstance.resetCurrentWidgetWillBuilder();
        }
        if (tableButtonRef.current) {
          tableButtonRef.current.checked = false;
        }
        if (textButtonRef.current) {
          textButtonRef.current.checked = false;
        }
        if (chartButtonRef.current) {
          chartButtonRef.current.checked = false;
        }
      },
    };
    widgetOperationMap[type]();
  }, []);

  const stopAutoBlur = (me: MouseEvent) => {
    if (DEFAULT_RATIO.concat(OTHER).includes((me.target as HTMLElement)?.innerText)) {
      me.preventDefault();
    }
  };

  useEffect(() => {
    ALayoutInstance.onEditStatusSubscribe((v) => {
      console.log(v, 'vvvvv');
      if (!operationButtonRef.current) {
        return;
      }
      operationButtonRef.current.checked = v;
    });
    ALayoutInstance.getCoordinateSystemLayer().onCoordinateSystemLayerEvent((e) => {
      // console.log(e, 'ALayoutInstance.coordinateSystemLayerSelection');
    });
    //回车后设置尺寸与比例
    ALayoutInstance.getEvent().onKeyUp((e: any) => {
      console.log(e, ratioRef.current?.value, 'e-kk');
      if (e.code === 'Enter') {
        //
        const splitCode = ratioRef.current?.value.split('*');
        if (splitCode?.some((n) => !Number(n))) {
          setRatio('1920*1080');
        }
        ALayoutInstance.getCoordinateSystemLayer().setScale(Number(scaleRef.current?.value), 0, 0);
        setPanelSize(ratioRef.current?.value || '');
        setRatioFocus(false);
      }
    });
    //订阅f按下时的数据
    ALayoutInstance.onSubscribeScale((s) => {
      console.log(s, 'scale-a');
      if (scaleRef.current) {
        scaleRef.current.value = String(s);
      }
    });
    document.addEventListener('mousedown', stopAutoBlur);

    return () => {
      document.removeEventListener('mousedown', stopAutoBlur);
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        margin: 'auto',
        left: '0px',
        right: '0px',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
      }}
    >
      <div className="navbar bg-base-200">
        <div className="flex-none">
          <div className="dropdown dropdown-bottom">
            <button
              tabIndex={0}
              ref={otherButtonRef}
              role="button"
              className="btn btn-circle btn-ghost"
              onBlur={() => {
                console.log(otherButtonRef, 'blur');
                if (menuButtonRef.current) {
                  menuButtonRef.current.checked = false;
                }
              }}
            >
              <label className="btn btn-circle swap swap-rotate">
                {/* this hidden checkbox controls the state */}
                <input type="checkbox" ref={menuButtonRef} />

                {/* hamburger icon */}
                <svg
                  className="swap-off fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 512 512"
                  style={{
                    color: '#989898',
                  }}
                >
                  <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                </svg>

                <svg
                  className="swap-on fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 1024 1024"
                  style={{
                    color: '#989898',
                  }}
                >
                  <path d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z" />
                </svg>
              </label>
            </button>
            <ul
              tabIndex={0}
              className="menu menu-lg dropdown-content z-[10] p-2 shadow bg-base-100 rounded-box w-52 mt-4"
            >
              {OTHER.map((other) => {
                return (
                  <li key={other}>
                    <a>{other}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="flex-1">
          {/* <a className="btn btn-ghost text-xl">daisyUI</a> */}

          {/* 图表 */}
          <div className="tooltip tooltip-bottom" data-tip="图表">
            <label className="btn btn-circle swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                ref={chartButtonRef}
                type="checkbox"
                onChange={(e) => {
                  setCurrentNavWidget('chart');
                }}
              />

              <svg
                className="swap-off fill-current"
                width="32"
                height="32"
                viewBox="0 0 2048 2048"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  color: '#989898',
                }}
              >
                <path
                  fill="currentColor"
                  d="M1408 512h512v512h-128V731l-576 575l-256-256l-704 705v37h1664v128H128V128h128v1445l704-703l256 256l485-486h-293z"
                />
              </svg>
              {/* hamburger icon */}

              {/* close icon */}
              <svg
                className="swap-on fill-current"
                width="32"
                height="32"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M500 384c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v308zM372.7 159.5L288 216l-85.3-113.7c-5.1-6.8-15.5-6.3-19.9 1L96 248v104h384l-89.9-187.8c-3.2-6.5-11.4-8.7-17.4-4.7"
                />
              </svg>
            </label>
          </div>
          {/* 表格 */}

          <div className="tooltip tooltip-bottom" data-tip="表格">
            <label className="btn btn-circle swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                type="checkbox"
                ref={tableButtonRef}
                onChange={(e) => {
                  setCurrentNavWidget('table');
                }}
              />
              <svg
                className="swap-off fill-current"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  color: '#989898',
                }}
              >
                <g fill="none" fill-rule="evenodd">
                  <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="currentColor"
                    d="M19 4a2 2 0 0 1 1.995 1.85L21 6v13a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V6a2 2 0 0 1 1.85-1.995L5 4zM8 16H5v3h3zm11 0h-9v3h9zM8 11H5v3h3zm11 0h-9v3h9zM8 6H5v3h3zm11 0h-9v3h9z"
                  />
                </g>
              </svg>

              <svg
                className="swap-on fill-current"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="none">
                  <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="currentColor"
                    d="M10 21h9a2 2 0 0 0 2-2v-2H10zm0-6h11v-5H10zm-2-5v5H3v-5zm2-2h11V6a2 2 0 0 0-2-2h-9zM8 4v4H3V6a2 2 0 0 1 2-2zm0 13v4H5a2 2 0 0 1-2-2v-2z"
                  />
                </g>
              </svg>

              {/* hamburger icon */}

              {/* close icon */}
            </label>
          </div>
          {/* 文字 */}
          <div className="tooltip tooltip-bottom" data-tip="文字">
            <label className="btn btn-circle swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                type="checkbox"
                ref={textButtonRef}
                onChange={(e) => {
                  setCurrentNavWidget('text');
                }}
              />
              <svg
                className="swap-off fill-current"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  color: '#989898',
                }}
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19h2m0 0h2m-2 0V5m0 0H6v1m6-1h6v1"
                />
              </svg>

              {/* hamburger icon */}

              {/* close icon */}
              <svg
                className="swap-on fill-current"
                width="32"
                height="32"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <mask id="ipSText0">
                    <g fill="none" stroke-linejoin="round" stroke-width="4">
                      <rect width="36" height="36" x="6" y="6" fill="#fff" stroke="#fff" rx="3" />
                      <path
                        stroke="#000"
                        stroke-linecap="round"
                        d="M16 19v-3h16v3M22 34h4m-2-16v16"
                      />
                    </g>
                  </mask>
                </defs>
                <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSText0)" />
              </svg>
            </label>
          </div>
          {/* 资源 */}
          <div className="tooltip tooltip-bottom" data-tip="资源">
            <label className="btn btn-circle swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                type="checkbox"
                ref={imageButtonRef}
                onChange={(e) => {
                  setCurrentNavWidget('image');
                }}
              />
              <svg
                className="swap-off fill-current"
                width="32"
                height="32"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  color: '#989898',
                }}
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M19 2H1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1m-1 14H2V4h16zm-3.685-5.123l-3.231 1.605l-3.77-6.101L4 14h12zM13.25 9a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5"
                  clip-rule="evenodd"
                />
              </svg>

              {/* hamburger icon */}

              {/* close icon */}
              <svg
                className="swap-on fill-current"
                width="32"
                height="32"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48M112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56s56-25.072 56-56s-25.072-56-56-56M64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336z"
                />
              </svg>
            </label>
          </div>
        </div>

        <div className="flex-none">
          {/* 操作指向 */}
          {/* <button tabIndex={0} role="button" className="btn btn-circle btn-ghost">
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="currentColor"
                d="M26.278 3.138c1.617-.622 3.206.967 2.584 2.585l-8.46 21.994c-.696 1.812-3.306 1.668-3.8-.209l-2.375-9.023a1 1 0 0 0-.712-.712l-9.023-2.375c-1.877-.494-2.02-3.104-.209-3.8z"
              />
            </svg>
          </button> */}
          <button className="btn btn-circle btn-ghost">
            <label className="swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                ref={operationButtonRef}
                type="checkbox"
                className="theme-controller"
                value="synthwave"
              />

              {/* sun icon */}
              <svg
                className="swap-off fill-current"
                width="32"
                height="32"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  color: '#989898',
                }}
              >
                <path
                  fill="currentColor"
                  d="M1 8c0-3.9 3.1-7 7-7s7 3.1 7 7s-3.1 7-7 7s-7-3.1-7-7M0 8c0 4.4 3.6 8 8 8s8-3.6 8-8s-3.6-8-8-8s-8 3.6-8 8"
                />
                <path fill="currentColor" d="m2 9l10-5l-5 10V9z" />
              </svg>
              <svg
                className="swap-on fill-current"
                width="32"
                height="32"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8s8-3.6 8-8s-3.6-8-8-8M7 14V9H2l10-5z"
                />
              </svg>
            </label>
          </button>
        </div>
        <div className="flex-none">
          {/* 比例 */}
          <div
            className="dropdown dropdown-bottom"
            style={{
              width: '80px',
              marginLeft: '3px',
              marginRight: '3px',
            }}
          >
            <input
              ref={scaleRef}
              type="text"
              defaultValue={1}
              placeholder="比例"
              className="input bg-base-100 input-bordered w-full max-w-xs"
            />
            <ul
              tabIndex={0}
              className="menu menu-lg dropdown-content z-[10] p-2 shadow bg-base-100 rounded-box w-52 mt-4"
            >
              {RATIO.map((R) => {
                return (
                  <li
                    key={R}
                    onClick={() => {
                      ALayoutInstance.getCoordinateSystemLayer().setScale(Number(R), 0, 0);
                    }}
                  >
                    <a>{R}</a>
                  </li>
                );
              })}
              {/* <li>
                <a>2</a>
              </li>
              <li>
                <a>1</a>
              </li>
              <li>
                <a>0.7</a>
              </li>
              <li>
                <a>0.6</a>
              </li> */}
            </ul>
          </div>
          {/* 主题 */}
          <button className="btn btn-circle btn-ghost">
            <label className="swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                ref={themeButtonRef}
                type="checkbox"
                className="theme-controller"
                value="synthwave"
                onChange={(e) => {
                  if (e.target.checked) {
                    ALayoutInstance.setTheme('dark');
                  } else {
                    ALayoutInstance.setTheme('light');
                  }
                }}
              />

              {/* sun icon */}
              <svg
                className="swap-on fill-current w-10 h-10"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M13.503 5.414a15.076 15.076 0 0 0 11.593 18.194a11.113 11.113 0 0 1-7.975 3.39c-.138 0-.278.005-.418 0a11.094 11.094 0 0 1-3.2-21.584M14.98 3a1.002 1.002 0 0 0-.175.016a13.096 13.096 0 0 0 1.825 25.981c.164.006.328 0 .49 0a13.072 13.072 0 0 0 10.703-5.555a1.01 1.01 0 0 0-.783-1.565A13.08 13.08 0 0 1 15.89 4.38A1.015 1.015 0 0 0 14.98 3"
                />
              </svg>

              {/* moon icon */}

              <svg
                className="swap-off fill-current w-10 h-10"
                width="32"
                height="32"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  color: '#989898',
                }}
              >
                <path
                  fill="currentColor"
                  d="M256 104c-83.813 0-152 68.187-152 152s68.187 152 152 152s152-68.187 152-152s-68.187-152-152-152m0 272a120 120 0 1 1 120-120a120.136 120.136 0 0 1-120 120M240 16h32v48h-32zm0 432h32v48h-32zm208-208h48v32h-48zm-432 0h48v32H16zm372.687 171.314l22.627-22.627l32 32l-22.627 22.627zm-320-320l22.628-22.628l32 32l-22.628 22.628zm-.002 329.375l32-32l22.628 22.626l-32 32zm320.002-320.003l32-32l22.628 22.628l-32 32z"
                />
              </svg>
            </label>
          </button>

          {/* 预览 */}
          <button className="btn btn-circle btn-ghost">
            <label className="swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                ref={themeButtonRef}
                type="checkbox"
                className="theme-controller"
                value="synthwave"
              />

              {/* sun icon */}
              <svg
                className="swap-off fill-current w-10 h-10"
                width="32"
                height="32"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  color: '#989898',
                }}
              >
                <path
                  fill="currentColor"
                  d="M10.804 8L5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"
                />
              </svg>

              {/* moon icon */}
              <svg
                className="swap-on fill-current w-10 h-10"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="currentColor" d="M11 17V7H8v10zm5 0V7h-3v10z" />
              </svg>
            </label>
          </button>

          {/* 恢复transform */}
          <button className="btn btn-circle btn-ghost">
            <label className="swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                ref={transformRef}
                type="checkbox"
                className="theme-controller"
                value="synthwave"
                onChange={onResetTransform}
              />
              <svg
                style={{
                  color: '#989898',
                }}
                className="swap-off fill-current w-10 h-10"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M9.808 20q-.344 0-.576-.232Q9 19.536 9 19.192V18H4.615q-.666 0-1.14-.475Q3 17.051 3 16.385V5.615q0-.666.475-1.14Q3.949 4 4.615 4h14.77q.666 0 1.14.475q.475.474.475 1.14V8q0 .213-.144.356q-.144.144-.357.144q-.212 0-.356-.144Q20 8.213 20 8V5.615q0-.269-.173-.442T19.385 5H4.615q-.269 0-.442.173T4 5.615v10.77q0 .269.173.442t.442.173h14.77q.269 0 .442-.173t.173-.442v-4.27q0-.269-.173-.442t-.442-.173h-7.777l1.996 1.996q.14.14.15.344q.01.204-.15.364t-.354.16q-.194 0-.354-.16l-2.638-2.639q-.243-.242-.243-.565q0-.323.243-.565l2.638-2.639q.14-.14.344-.15q.204-.01.364.15t.16.354q0 .194-.16.354L11.608 10.5h7.777q.69 0 1.152.463q.463.462.463 1.152v4.27q0 .666-.475 1.14q-.474.475-1.14.475H15v1.192q0 .344-.232.576q-.232.232-.576.232zm2.692-9"
                />
              </svg>

              {/* sun icon */}

              {/* moon icon */}
              <svg
                style={{
                  color: '#989898',
                }}
                className="swap-on fill-current w-10 h-10"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-dasharray="15"
                  stroke-dashoffset="15"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="M12 3C16.9706 3 21 7.02944 21 12"
                >
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    dur="0.3s"
                    values="15;0"
                  />
                  <animateTransform
                    attributeName="transform"
                    dur="1.5s"
                    repeatCount="indefinite"
                    type="rotate"
                    values="0 12 12;360 12 12"
                  />
                </path>
              </svg>
            </label>
          </button>
          {/* 全屏 */}
          <button tabIndex={0} role="button" className="btn btn-circle btn-ghost">
            <svg
              width="32"
              height="32"
              style={{
                color: '#989898',
              }}
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" fill-rule="evenodd" stroke="currentColor">
                <path
                  d="M10.5 1.5h2a2 2 0 012 2v2M10.5 14.5h2a2 2 0 002-2v-2M5.5 1.5h-2a2 2 0 00-2 2v2M5.5 14.5h-2a2 2 0 01-2-2v-2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <rect x="4.5" y="4.5" width="7" height="7" rx="1.5"></rect>
              </g>
            </svg>
          </button>
          {/* 保存 */}
          <button tabIndex={0} role="button" className="btn btn-circle btn-ghost">
            <svg
              width="32"
              height="32"
              style={{
                color: '#989898',
              }}
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="m27.71 9.29l-5-5A1 1 0 0 0 22 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V10a1 1 0 0 0-.29-.71M12 6h8v4h-8Zm8 20h-8v-8h8Zm2 0v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8H6V6h4v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6.41l4 4V26Z"
              />
            </svg>
          </button>
          <div className="dropdown dropdown-end">
            <button tabIndex={0} role="button" className="btn btn-circle btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </button>
            <ul
              tabIndex={0}
              className="menu menu-lg dropdown-content z-[10] p-2 shadow bg-base-100 rounded-box w-52 mt-4"
            >
              <li>
                <a>隐藏网格</a>
              </li>
              <li>
                <a>隐藏操作栏</a>
              </li>

              <li className="dropdown dropdown-left">
                <input
                  type="text"
                  value={ratio}
                  ref={ratioRef}
                  placeholder="面板比例"
                  className="input bg-base-100 input-bordered w-full max-w-xs"
                  onFocus={() => {
                    setRatioFocus(true);
                  }}
                  onBlur={() => {
                    setRatioFocus(false);
                  }}
                  onChange={(e) => {
                    setRatio(e.target.value);
                  }}
                />
                {ratioFocus && (
                  <ul
                    tabIndex={2}
                    className="mr-2 menu menu-lg dropdown-content z-[10] p-2 shadow bg-base-100 rounded-box w-52 mt-4"
                  >
                    {DEFAULT_RATIO.map((ra) => {
                      return (
                        <li
                          key={ra}
                          onClick={(e) => {
                            setRatio(ra);
                            setPanelSize(ra);
                          }}
                        >
                          <a
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            {ra}
                            {ra === ratio && (
                              <span>
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 1024 1024"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M512 64a448 448 0 1 1 0 896a448 448 0 0 1 0-896m-55.808 536.384l-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"
                                  />
                                </svg>
                              </span>
                            )}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <div className="toast toast-center" style={{
        zIndex:10
      }}>
        <div className="alert alert-info">
          <span>New mail arrived.</span>
        </div>
        <div className="alert alert-success">
          <span>Message sent successfully.</span>
        </div>
      </div> */}
    </div>
  );
};
