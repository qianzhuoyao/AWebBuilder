import { FC, useEffect, useMemo, useState, startTransition } from 'react';
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
        e.type === 'grid-zoom-set' ||
        e.type === 'grid-scale-set'
      ) {
        const newTickX: number[] = [];
        const newTickY: number[] = [];
        ALayoutInstance.getCoordinateSystemLayerGrid().map((mark: any) => {
          console.log(mark, e.type, 'mark');
          if (mark.top === 0) {
            newTickX.push(mark.lineCoords.tl.x);
          }
          if (mark.left === 0) {
            newTickY.push(mark.lineCoords.tl.y);
          }
        });
        console.log(
          {
            x: newTickX,
            y: newTickY,
          },
          'newTickY'
        );
        startTransition(() => {
          setTick({
            x: newTickX,
            y: newTickY,
          });
        });
      }
    });

    setProvider(document.getElementById('content') as HTMLElement);

    ALayoutInstance.setCoordinateLayerParentDom(document.getElementById('content') as HTMLElement);
    ALayoutInstance.setCoordinateSystemSize({
      width: 1920,
      height: 1080,
    });

    if (ALayoutInstance.getCoordinateSystemLayerGrid()) {
      setTick(ALayoutInstance.getCoordinateSystemLayerGrid());
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
                  {tick?.x?.map((t: number) => {
                    return (
                      <>
                        {t >= 0 && (
                          <div
                            key={t}
                            style={{
                              position: 'absolute',
                              left: t + unitSize + 'px',
                              fontSize: '14px',
                            }}
                          >
                            {Math.floor(t)}
                          </div>
                        )}
                      </>
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
                  {tick?.y?.map((t: number) => {
                    return (
                      <>
                        {t >= 0 && (
                          <div
                            key={t}
                            style={{
                              position: 'absolute',
                              top: t + unitSize - 9 + 'px',
                              width: '100%',
                              textAlign: 'right',
                              fontSize: '14px',
                              paddingRight: '5px',
                            }}
                          >
                            {Math.floor(t)}
                          </div>
                        )}
                      </>
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
