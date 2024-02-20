import { Formik, Form, FieldArray, FormikProps, Field } from 'formik';
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
  Tabs,
} from '@nextui-org/react';
import { useSelector, useDispatch } from 'react-redux';
import { ILs, IProtocol, updateNodeConfigInfo } from '../../store/slice/logicSlice.ts';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { arrayToGenObj, objToGenArray } from '../../comp/computeTools.ts';
import ReactJson from 'react-json-view';
import { useTheme } from 'next-themes';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView, ViewUpdate } from '@codemirror/view';
import beautify_js from 'js-beautify';

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
      configInfo: {
        ...(logicState.logicNodes[logicState.target[0]]?.configInfo || {}),
        params: JSON.parse(value),
      },
    }));
  }, [logicState.logicNodes, logicState.target]);

  const defaultFormValue = useMemo(() => {
    if (logicState.logicNodes[logicState.target[0]].typeId === 'logic_D_get') {
      return objToGenArray(logicState.logicNodes[logicState.target[0]]?.configInfo?.params as Record<string, any>).result;
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
    if (logicState.logicNodes[logicState.target[0]].typeId === 'logic_D_get') {
      return objToGenArray(logicState.logicNodes[logicState.target[0]]?.configInfo?.params as Record<string, any>).result;
    } else {
      return '';
    }

  }, [logicState.logicNodes, logicState.target]);

  const updateValue = useCallback((newObj: object) => {

    dispatch(updateNodeConfigInfo({
      id: logicState.target[0],
      configInfo: {
        ...(logicState.logicNodes[logicState.target[0]]?.configInfo || {}),
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
      return objToGenArray(logicState.logicNodes[logicState.target[0]]?.configInfo?.params as Record<string, any>).result;
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
        console.log(JSONObj, formRef.current, logicState, {
          ...(logicState.logicNodes[logicState.target[0]]?.configInfo || {}),
          params: JSONObj,
        }, 'JSONObj');
        dispatch(updateNodeConfigInfo({
          id: logicState.target[0],
          configInfo: {
            ...(logicState.logicNodes[logicState.target[0]]?.configInfo || {}),
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
      configInfo: {
        ...(logicState.logicNodes[logicState.target[0]]?.configInfo || {}),
        url: url,
      },
    }));
  }, [logicState.logicNodes, logicState.target]);

  const updateDesc = useCallback((desc: string) => {
    dispatch(updateNodeConfigInfo({
      id: logicState.target[0],
      configInfo: {
        ...(logicState.logicNodes[logicState.target[0]]?.configInfo || {}),
        desc: desc,
      },
    }));
  }, [logicState.logicNodes, logicState.target]);

  const updateProtocol = useCallback((protocol: IProtocol) => {
    dispatch(updateNodeConfigInfo({
      id: logicState.target[0],
      configInfo: {
        ...(logicState.logicNodes[logicState.target[0]]?.configInfo || {}),
        protocol: protocol,
      },
    }));
  }, [logicState.logicNodes, logicState.target]);
  return <>
    <>
      <Input
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
                    `${logicState.logicNodes[logicState.target[0]]?.configInfo?.protocol}://`
                  }</span>
                </div>
              </button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              selectionMode="multiple"
              selectedKeys={new Set(
                [logicState.logicNodes[logicState.target[0]]?.configInfo?.protocol as IProtocol],
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
        onChange={e => {
          updateDesc(e.target.value);
        }}
      />
      <RadioGroup
        className={'mt-2'}
        value={'post'}
        orientation="horizontal"
      >
        <Radio value="post">post</Radio>
        {/*<Radio value="get" disabled>get</Radio>*/}
        {/*<Radio value="update" disabled>update</Radio>*/}
        {/*<Radio value="patch" disabled>patch</Radio>*/}
      </RadioGroup>
    </>
  </>;
});


const RemoteTestParams = memo(() => {
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  return <>
    <p className={'border-t-1 border-default-100'}>
         <span>
            <small>protocol:</small>
           <small>{logicState.logicNodes[logicState.target[0]]?.configInfo?.protocol}</small>
         </span>
    </p>
    <p>
         <span>
            <small>url:</small>
           <small>{logicState.logicNodes[logicState.target[0]]?.configInfo?.url}</small>
         </span>
    </p>
    <p>
         <span>
            <small>params:</small>
           <code>{JSON.stringify(logicState.logicNodes[logicState.target[0]]?.configInfo?.params)}</code>
         </span>
    </p>

    <p className={'border-b-1 border-default-100'}>
         <span>
            <small>method:</small>
           <small>{logicState.logicNodes[logicState.target[0]]?.configInfo?.method}</small>
         </span>
    </p></>;
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
      content: '',
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
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const [loading, setLoading] = useState(false);
  return <>
    <Card className="max-w-[340px]">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar isBordered radius="full" size="md" src="/avatars/avatar-1.png" />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">remote</h4>
            <h5 className="text-small tracking-tight text-default-400">@admin</h5>
          </div>
        </div>
        <Button
          className={loading ? 'bg-transparent text-foreground border-default-200' : ''}
          color="primary"
          radius="full"
          size="sm"
          variant={loading ? 'bordered' : 'solid'}
          onPress={() => setLoading(!loading)}
        >
          {loading ? '重新发送' : '发送'}
        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>
          {logicState.logicNodes[logicState.target[0]]?.configInfo?.desc || '暂无描述'}
        </p>
        <RemoteTestParamsRes></RemoteTestParamsRes>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">请求状态</p>
          <p className=" text-default-400 text-small">暂未发起</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">请求次数</p>
          <p className=" text-default-400 text-small">0</p>
        </div>
      </CardFooter>
    </Card>
  </>;
});
export const RemoteBuilder = memo(() => {
  return <div className="flex w-full flex-col px-1">
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

