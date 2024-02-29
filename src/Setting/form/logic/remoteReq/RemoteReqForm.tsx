import { Formik, Form, FieldArray, FormikProps, Field } from 'formik';
// import { Icon } from '@iconify-icon/react';
import type { SVGProps } from 'react';
import {
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  RadioGroup,
  CardHeader,
  Avatar,
  Button,
  Radio,
  DropdownTrigger,
  Textarea,
  Input,
  CardFooter,
  Tab,
  Tabs, Switch, Tooltip,
} from '@nextui-org/react';
import { useSelector, useDispatch } from 'react-redux';
import { ILs, IProtocol, updateNodeConfigInfo } from '../../../../store/slice/logicSlice.ts';
import { memo, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { arrayToGenObj, objToGenArray } from '../../../../comp/computeTools.ts';
import ReactJson from 'react-json-view';
import { useTheme } from 'next-themes';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView, ViewUpdate } from '@codemirror/view';
import beautify_js from 'js-beautify';
import { CopyBlock } from 'react-code-blocks';
import { initialState, TestRemoteContext, TestRemoteReducer } from './RemoteReducer.ts';
import { useQuery } from 'react-query';
import { useAutoHeight } from '../../../../comp/useAutoHeight.tsx';

interface IInitValueType {
  params: {
    key: string,
    value: string
  }[];
}

const initialValues: IInitValueType = {
  params: [
    {
      key: '',
      value: '',
    },
  ],
};

const RemoteReqCodeForm = memo(() => {
  const mirrorRef = useRef<ReactCodeMirrorRef>(null);
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const onChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    console.log(value, viewUpdate, JSON.parse(value), 'viewUpdateviewUpdate');

    dispatch(updateNodeConfigInfo({
      id: logicState.target[0],
      infoType: 'remoteReqInfo',
      configInfo: {
        ...(logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo || {}),
        params: JSON.parse(value),
      },
    }));
  }, [logicState.logicNodes, logicState.target]);

  const defaultFormValue = useMemo(() => {
    if (logicState.logicNodes[logicState.target[0]].typeId === 'logic_D_get') {
      return objToGenArray(logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.params as Record<string, any>).result;
    } else {
      return '';
    }

  }, [logicState.logicNodes, logicState.target]);
  useEffect(() => {
    if (mirrorRef.current?.view) {
      console.log(mirrorRef.current, 'mirrorRef.current');
    }

  }, []);
  return <CodeMirror
    ref={mirrorRef}
    value={beautify_js(JSON.stringify(arrayToGenObj(defaultFormValue || [])), { indent_size: 2 })}
    height="200px"
    lang={'json'}
    theme={theme === 'dark' ? 'dark' : 'light'}
    extensions={[json(), EditorView.lineWrapping]}

    basicSetup={{
      lintKeymap: false,

    }}
    onChange={onChange} />;
});

const RemoteReqJSONForm = memo(() => {
  const { theme } = useTheme();
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const dispatch = useDispatch();
  const defaultFormValue = useMemo(() => {
    if (logicState.logicNodes[logicState.target[0]].typeId === 'logic_D_get'
    ) {
      return objToGenArray(logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.params as Record<string, any>).result;
    } else {
      return '';
    }

  }, [logicState.logicNodes, logicState.target]);

  const updateValue = useCallback((newObj: object) => {

    dispatch(updateNodeConfigInfo({
      id: logicState.target[0],
      infoType: 'remoteReqInfo',
      configInfo: {
        ...(logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo || {}),
        params: newObj,
      },
    }));


  }, [logicState.logicNodes, logicState.target]);

  return <>
    <ReactJson
      name={'params'}
      theme={theme === 'dark' ? 'solarized' : 'rjv-default'}
      src={arrayToGenObj(defaultFormValue || [])}

      onEdit={(e) => {
        console.log(e);
        updateValue(e.updated_src);
      }}
      onSelect={(s) => {
        console.log(s);

      }}
      onAdd={(a) => {
        console.log(a);
        updateValue(a.updated_src);
      }}
      onDelete={(d) => {
        console.log(d);
        updateValue(d.updated_src);
      }}
    />
  </>;
});

const RemoteReqForm = memo(() => {

  const formRef = useRef<FormikProps<IInitValueType>>(null);
  const dispatch = useDispatch();
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });

  const onChangeLogicNodeInfo = useCallback((newValue: string, key: string) => {
    formRef.current?.setFieldValue(key, newValue);
    formRef.current?.submitForm();

  }, [logicState]);

  const defaultFormValue = useMemo(() => {
    if (logicState.logicNodes[logicState.target[0]].typeId === 'logic_D_get') {
      return objToGenArray(logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.params as Record<string, any>).result;
    } else {
      return undefined;
    }

  }, [logicState.logicNodes, logicState.target]);


  useEffect(() => {
    if (defaultFormValue) {
      formRef.current?.setValues({
        params: defaultFormValue,
      });
    } else {
      formRef.current?.setValues(initialValues);
    }
  }, [logicState.target]);

  return <div>
    <Formik
      innerRef={formRef}
      initialValues={defaultFormValue ? {
        params: defaultFormValue,
      } : initialValues}
      onSubmit={async (values) => {
        const JSONObj = arrayToGenObj(values.params || []);
        dispatch(updateNodeConfigInfo({
          id: logicState.target[0],
          infoType: 'remoteReqInfo',
          configInfo: {
            ...(logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo || {}),
            params: JSONObj,
          },
        }));
      }}
    >
      {({ values }) => (
        <Form>
          <FieldArray name="params">
            {({ insert, remove, push }) => (
              <div>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => push({ key: '', value: '' })}
                >
                  添加属性
                </button>
                {values.params.length > 0 &&
                  values.params.map((param, index) => (
                    <div className="flex items-center my-1 justify-between border-y-1 border-default-100 py-1"
                         key={index}>
                      <div>
                        <Field name={`params.${index}.key`}
                               render={
                                 ({ field }) => {
                                   return <Input
                                     className={'mb-1'}
                                     key={'outside-left'}
                                     type="text"
                                     placeholder={'key'}
                                     labelPlacement={'outside-left'}
                                     {...field}
                                     onChange={(e) => {
                                       onChangeLogicNodeInfo(e.target.value, `params.${index}.key`);
                                     }}
                                   />;
                                 }
                               }
                        >
                        </Field>
                        <Field name={`params.${index}.value`}
                               render={
                                 ({ field }) => {
                                   return <Input
                                     key={'outside-left'}
                                     type="text"
                                     placeholder={'value'}
                                     labelPlacement={'outside-left'}
                                     {...field}
                                     onChange={(e) => {
                                       onChangeLogicNodeInfo(e.target.value, `params.${index}.value`);
                                     }}
                                   />;
                                 }
                               }
                        >
                        </Field>
                      </div>
                      <div className="col">
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => {
                            remove(index);
                            formRef.current?.submitForm();
                          }}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}

              </div>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  </div>;
});
const tabs = [
  {
    id: 'params',
    label: '手动',
    content: <>
      <RemoteReqForm />
    </>,
  },
  {
    id: 'JSON',
    label: 'JSON',
    content: <>
      <RemoteReqJSONForm />
    </>,
  },
  {
    id: 'code',
    label: '代码块',
    content: <>
      <RemoteReqCodeForm />
    </>,
  },
];

export const RemoteUrl = memo(() => {
  const height = useAutoHeight();
  const dispatch = useDispatch();
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });

  const items: {
    key: IProtocol,
    label: string
  }[] = useMemo(() => [
    {
      key: 'https',
      label: 'https',
    },
    {
      key: 'http',
      label: 'http',
    },
  ], []);

  const updateUrl = useCallback((url: string) => {
    dispatch(updateNodeConfigInfo({
      id: logicState.target[0],
      infoType: 'remoteReqInfo',
      configInfo: {
        ...(logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo || {}),
        url: url,
      },
    }));
  }, [logicState.logicNodes, logicState.target]);

  const updateMethod = useCallback((method: 'post' | 'get') => {
    dispatch(updateNodeConfigInfo({
      id: logicState.target[0],
      infoType: 'remoteReqInfo',
      configInfo: {
        ...(logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo || {}),
        method: method,
      },
    }));
  }, [logicState.logicNodes, logicState.target]);

  const updateDesc = useCallback((desc: string) => {
    dispatch(updateNodeConfigInfo({
      id: logicState.target[0],
      infoType: 'remoteReqInfo',
      configInfo: {
        ...(logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo || {}),
        desc: desc,
      },
    }));
  }, [logicState.logicNodes, logicState.target]);

  const updateProtocol = useCallback((protocol: IProtocol) => {
    dispatch(updateNodeConfigInfo({
      id: logicState.target[0],
      infoType: 'remoteReqInfo',
      configInfo: {
        ...(logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo || {}),
        protocol: protocol,
      },
    }));
  }, [logicState.logicNodes, logicState.target]);


  const onHandleChangeStrict = useCallback((checked: boolean) => {
    console.log(checked, logicState.target[0], 'checked');
    dispatch(updateNodeConfigInfo({
      id: logicState.target[0],
      infoType: 'remoteReqInfo',
      configInfo: {
        ...(logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo || {}),
        strict: checked,
      },
    }));
  }, [logicState.logicNodes, logicState.target]);

  return <>
    <div style={{
      height: height - 80 + 'px',
    }}>
      <Input
        value={logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.url}
        classNames={{
          base: 'w-full',
          mainWrapper: 'w-full',
        }}
        startContent={
          <Dropdown>
            <DropdownTrigger>
              <button>
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">{
                    `${logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.protocol}://`
                  }</span>
                </div>
              </button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              selectionMode="multiple"
              selectedKeys={new Set(
                [logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.protocol as IProtocol],
              )}
              aria-label="PROTOCOL"

              items={items}>
              {(item) => (
                <DropdownItem
                  key={item.key}
                  onClick={() => {
                    updateProtocol(item.key);
                  }}
                >
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        }
        key={'outside-left'}
        type="url"
        label="Url"
        labelPlacement={'outside-left'}
        onChange={e => {
          updateUrl(e.target.value);
        }}
      />
      <Textarea
        label="描述"
        labelPlacement={'outside-left'}
        placeholder="关于本次远程通讯的描述"
        className="max-w-xs mt-1"
        classNames={{
          innerWrapper: 'h-[200px]',
        }}
        value={logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.desc}
        onChange={e => {
          updateDesc(e.target.value);
        }}
      />
      <div className={'flex justify-between items-center h-[60px]'}>
        <RadioGroup

          value={logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.method}
          orientation="horizontal"
          onValueChange={e => {
            console.log(e, 'erererer');
            updateMethod(e as 'get');
          }}
        >
          <Radio value="post">post</Radio>
          <Radio value="get">get</Radio>
          {/*<Radio value="get" disabled>get</Radio>*/}
          {/*<Radio value="update" disabled>update</Radio>*/}
          {/*<Radio value="patch" disabled>patch</Radio>*/}
        </RadioGroup>

        <Tooltip
          color={'default'}
          content={'严格模式下,公用逻辑路径将不会复用'}
          placement="top"
          className="capitalize"
        >
          <div className={'my-1 items-center flex'}>
            <small className={'mr-1'}>严格模式</small>
            <Switch size={'sm'}
                    isSelected={logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.strict}
                    aria-label="strictMode" onValueChange={checked => {
              onHandleChangeStrict(checked);
            }} />
          </div>
        </Tooltip>

      </div>
    </div>
  </>;
});


export function BxsError(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor"
          d="M12.884 2.532c-.346-.654-1.422-.654-1.768 0l-9 17A.999.999 0 0 0 3 21h18a.998.998 0 0 0 .883-1.467zM13 18h-2v-2h2zm-2-4V9h2l.001 5z"></path>
  </svg>);
}

const RemoteTestResponse = memo(() => {
  const TestCTX = useContext(TestRemoteContext);
  const { theme } = useTheme();
  console.log(TestCTX.response, 'TestCTX');
  return <>
    {
      TestCTX.response?.isError ? <>
        <div className={'flex items-center'}>
          <BxsError className={'w-[20px] h-[20px] relative top-[3px]'}></BxsError>
          {/*<Icon className={'w-[20px] h-[20px] relative top-[3px]'} icon="material-symbols:error" />*/}
          <small className={'ml-3'}>请求错误</small>
        </div>
        <CopyBlock
          text={beautify_js(JSON.stringify(TestCTX.response?.error?.message), { indent_size: 2 })}
          language={'javascript'}
          theme={{
            mode: theme === 'dark' ? 'dark' : 'light',
          }}

          copied={false}
          showLineNumbers={false}
        />
      </> : <div className={'overflow-scroll max-h-[300px]'}>
        <CopyBlock
          text={beautify_js(JSON.stringify(TestCTX.response?.data), { indent_size: 2 })}
          language={'json'}
          theme={{
            mode: theme === 'dark' ? 'dark' : 'light',
          }}

          copied={false}
          showLineNumbers={false}
        />
      </div>
    }
  </>;
});

const RemoteTestParams = memo(() => {
  const TestCTX = useContext(TestRemoteContext);
  // const logicState = useSelector((state: { logicSlice: ILs }) => {
  //   return state.logicSlice;
  // });
  const { theme } = useTheme();
  const requestParams = TestCTX.request;

  return <>
    <p className={'border-y-1 border-default-100'}>
      <CopyBlock
        text={beautify_js(JSON.stringify(requestParams), { indent_size: 2 })}
        language={'json'}
        theme={{
          mode: theme === 'dark' ? 'dark' : 'light',
        }}

        showLineNumbers={true}
      />
    </p>
  </>;
});

const RemoteTestParamsRes = memo(() => {

  const paramsResTabs = useMemo(() => [

    {
      id: 'request',
      label: 'request',
      content: <RemoteTestParams></RemoteTestParams>,
    }, {
      id: 'response',
      label: 'response',
      content: <RemoteTestResponse></RemoteTestResponse>,
    },
  ], []);

  return <div className="flex w-full flex-col">
    <Tabs aria-label="Dynamic tabs" items={paramsResTabs}>
      {(item) => (
        <Tab key={item.id} title={item.label}>
          <Card>
            <CardBody>
              {item.content}
            </CardBody>
          </Card>
        </Tab>
      )}
    </Tabs>
  </div>;
});


export const RemoteTest = memo(() => {
  const height = useAutoHeight();

  const [state, dispatch] = useReducer(TestRemoteReducer, initialState);

  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const [sendTime, setSendTime] = useState(0);

  useEffect(() => {
    dispatch({
      type: 'req',
      payload: {
        protocol: logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.protocol || '-',
        url: logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.url || '-',
        params: logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.params || '-',
        method: logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.method || '-',
      },
    });
  }, [logicState.logicNodes, logicState.target]);

  const URL = useMemo(() =>
      (logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.protocol || '') + '://' + (logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.url || '')
    , [logicState.logicNodes, logicState.target]);

  const query = () => fetch(URL, {
    method: logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.method || 'post',
    body: logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.method === 'post'
      ?
      JSON.stringify(logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.params || {})
      : null,
  }).then((res) => res.json());

  const { isLoading, isError, error, data, isFetching } =
    useQuery([sendTime], () => query(), {
      retry: 0,
      enabled: !!sendTime,

    });

  useEffect(() => {
    dispatch({
      type: 'resp',
      payload: {
        isLoading, isError, error, data,
      },
    });
  }, [isLoading, isError, error, data]);

  return <div style={{
    height: height - 80 + 'px',
  }}>
    <TestRemoteContext.Provider value={{ ...state }}>
      <Card className="max-w-[340px]">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Avatar isBordered radius="full" size="md" name={'remote'} />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">remote</h4>
              <h5 className="text-small tracking-tight text-default-400">@admin</h5>
            </div>
          </div>
          <Button
            className={''}
            color="primary"
            radius="full"
            size="sm"
            isLoading={isFetching}
            variant={'solid'}
            isDisabled={!logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.url}
            onPress={() => {
              setSendTime(sendTime + 1);
            }}
          >
            {sendTime ? '重新发送' : '发送'}
          </Button>
        </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-400">
          <p className={'mb-1'}>
            {logicState.logicNodes[logicState.target[0]]?.configInfo?.remoteReqInfo?.desc || '暂无描述'}
          </p>
          <RemoteTestParamsRes></RemoteTestParamsRes>
        </CardBody>
        <CardFooter className="gap-3">
          <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">请求状态</p>
            <p className=" text-default-400 text-small">{
              sendTime ? isFetching ? '发送中' : '发送完毕' : '暂未发起'
            }</p>
          </div>
          <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">请求次数</p>
            <p className=" text-default-400 text-small">{sendTime}</p>
          </div>
        </CardFooter>
      </Card>
    </TestRemoteContext.Provider>
  </div>;
});
export const RemoteBuilder = memo(() => {
  const height = useAutoHeight();
  return <div className="flex w-full flex-col px-1" style={{
    height: height - 80 + 'px',
  }}>
    <Tabs aria-label="Dynamic tabs" items={tabs} classNames={{
      panel: 'p-1',
      base: 'px-1',
    }}>
      {(item) => (
        <Tab key={item.id} title={item.label}>
          <Card>
            <CardBody>
              {item.content}
            </CardBody>
          </Card>
        </Tab>
      )}
    </Tabs>
  </div>;
});

