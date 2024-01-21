import { FC, useEffect, useMemo, useState } from 'react';
import { ALayoutInstance, setProvider } from 'AWebBuilder';

interface ILayout {
  leftNode: React.ReactNode;
  topNode: React.ReactNode;
  RightNode: React.ReactNode;
  content: React.ReactNode;
}

const unitSize = 40;

export const Layout: FC<ILayout> = ({ leftNode, topNode, RightNode, content }) => {
  const [tick, setTick] = useState<any>(null);
  const [panelLoading, setPanelLoading] = useState(false);

  useEffect(() => {
    ALayoutInstance.onSubscribeCSTransform({
      end: () => {
        console.log('onSubscribeCSTransform');
      },
    });
    ALayoutInstance.onSubscribeLoading((loading) => {
      setPanelLoading(loading);
    });
    ALayoutInstance.onCoordinateSystemLayerEvent((e) => {
      if (
        e.type === 'grid-size-set' ||
        e.type === 'grid-transform-set' ||
        e.type === 'grid-zoom-set'
      ) {
        setTick(ALayoutInstance.getCoordinateSystemLayerTick());
      }
    });

    setProvider(document.getElementById('content') as HTMLElement);

    ALayoutInstance.setCoordinateSystemLayerCanvasParentDom(
      document.getElementById('content') as HTMLElement
    );
    ALayoutInstance.setCoordinateSystemSize({
      width: 1920,
      height: 1080,
    });

    if (ALayoutInstance.getCoordinateSystemLayerTick()) {
      setTick(ALayoutInstance.getCoordinateSystemLayerTick());
    }
  }, []);
  return (
    <>
      <div>
        <div
          className="border-primary-content"
          style={{
            borderColor: 'hsl(var(--nc) / var(--tw-border-opacity))',
            borderBottomWidth: '1px',
          }}
        >
          {topNode}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              width: '320px',
              height: '100vh',
            }}
          >
            {leftNode}
          </div>
          {panelLoading && (
            <div
              id="mask-panel"
              className="bg-base-300"
              style={{
                width: 'calc(100% - 640px)',
                height: '100vh',
                position: 'absolute',
                display: 'flex',
                left: '320px',
                opacity: '0.4',
                zIndex: '1000',
              }}
            >
              <span
                style={{
                  margin: 'auto',
                }}
                className="loading loading-bars loading-lg"
              ></span>
            </div>
          )}
          <div
            style={{
              position: 'relative',
              width: 'calc(100% - 640px)',
              height: '100vh',
              overflow: 'scroll',
            }}
          >
            {useMemo(() => {
              return (
                <div
                  id="x-line"
                  style={{
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    display: 'flex',
                    width: '100%',
                    height: unitSize + 'px',
                    alignItems: 'flex-end',
                  }}
                >
                  {tick?.x?.map((t, index) => {
                    return (
                      <div
                        key={t}
                        style={{
                          position: 'absolute',
                          left: (index + 1) * unitSize - String(t).length * 4.5 + 'px',
                          fontSize: '14px',
                        }}
                      >
                        {t - unitSize}
                      </div>
                    );
                  })}
                </div>
              );
            }, [tick])}
            <div
              id="content"
              style={{
                width: '100%',
                height: '100%',
                left: unitSize + 'px',
                top: unitSize + 'px',
              }}
            >
              {content}
            </div>
            {useMemo(
              () => (
                <div
                  id="y-line"
                  style={{
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    width: unitSize + 'px',
                    height: '100%',
                  }}
                >
                  {tick?.y?.map((t, index) => {
                    return (
                      <div
                        key={t}
                        style={{
                          position: 'absolute',
                          top: (index + 1) * unitSize - 9 + 'px',
                          width: '100%',
                          textAlign: 'right',
                          fontSize: '14px',
                          paddingRight: '5px',
                        }}
                      >
                        {t - unitSize}
                      </div>
                    );
                  })}
                </div>
              ),
              [tick]
            )}
          </div>
          <div
            style={{
              width: '320px',
              height: '100vh',
            }}
          >
            {RightNode}
          </div>
        </div>
      </div>
    </>
  );
};
