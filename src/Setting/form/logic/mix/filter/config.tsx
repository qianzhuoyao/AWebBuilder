import merge from 'lodash/merge';
import {
  BasicFuncs, Utils, BasicConfig,
  // types:
  Operators, Fields, Types, Conjunctions, LocaleSettings, OperatorProximity, Funcs,
  Settings,
  DateTimeFieldSettings, TextFieldSettings, SelectFieldSettings, MultiSelectFieldSettings, NumberFieldSettings,
  Widgets,

  Config,
} from '@react-awesome-query-builder/ui';
import moment from 'moment';
import { zhCN as muizhCN } from '@mui/material/locale';
import { MuiConfig } from '@react-awesome-query-builder/mui';
import { ReactNode } from 'react';


const { simulateAsyncFetch } = Utils.Autocomplete;


const skinToConfig: Record<string, Config> = {
  vanilla: BasicConfig,
  mui: MuiConfig,
};

function CustomCheckbox(props: { value: string, children: ReactNode }) {
  return null;
}

export default (skin: string) => {


  const InitialConfig = skinToConfig[skin] as BasicConfig;

  const demoListValues = [
    { title: 'A', value: 'a' },
    { title: 'AA', value: 'aa' },
    { title: 'AAA1', value: 'aaa1' },
    { title: 'AAA2', value: 'aaa2' },
    { title: 'B', value: 'b' },
    { title: 'C', value: 'c' },
    { title: 'D', value: 'd' },
    { title: 'E', value: 'e' },
    { title: 'F', value: 'f' },
    { title: 'G', value: 'g' },
    { title: 'H', value: 'h' },
    { title: 'I', value: 'i' },
    { title: 'J', value: 'j' },
  ];
  const simulatedAsyncFetch = simulateAsyncFetch(demoListValues, 3);

  const conjunctions: Conjunctions = {
    ...InitialConfig.conjunctions,
    AND: {
      ...InitialConfig.conjunctions.AND,
      label: '与',
    },
    OR: {
      ...InitialConfig.conjunctions.OR,
      label: '或',
    },
  };

  const proximity: OperatorProximity = {
    ...InitialConfig.operators.proximity,
    valueLabels: [
      { label: 'Word 1', placeholder: 'Enter first word' },
      { label: 'Word 2', placeholder: 'Enter second word' },
    ],
    textSeparators: [
      //'Word 1',
      //'Word 2'
    ],
    options: {
      ...InitialConfig.operators.proximity.options,
      optionLabel: 'Near', // label on top of "near" selectbox (for config.settings.showLabels==true)
      optionTextBefore: 'Near', // label before "near" selectbox (for config.settings.showLabels==false)
      optionPlaceholder: 'Select words between', // placeholder for "near" selectbox
      minProximity: 2,
      maxProximity: 10,
      defaults: {
        proximity: 2,
      },
      customProps: {},
    },
  };

  const operators: Operators = {
    ...InitialConfig.operators,
    // examples of  overriding
    proximity,
    between: {
      ...InitialConfig.operators.between,
      valueLabels: [
        'Value from',
        'Value to',
      ],
      textSeparators: [
        'from',
        'to',
      ],
    },
  };


  const widgets: Widgets = {
    ...InitialConfig.widgets,
    // examples of overriding
    text: {
      ...InitialConfig.widgets.text,
    },
    textarea: {
      ...InitialConfig.widgets.textarea,
      maxRows: 3,
    },
    slider: {
      ...InitialConfig.widgets.slider,
    },
    rangeslider: {
      ...InitialConfig.widgets.rangeslider,
    },
    date: {
      ...InitialConfig.widgets.date,
      dateFormat: 'DD.MM.YYYY',
      valueFormat: 'YYYY-MM-DD',
    },
    time: {
      ...InitialConfig.widgets.time,
      timeFormat: 'HH:mm',
      valueFormat: 'HH:mm:ss',
    },
    datetime: {
      ...InitialConfig.widgets.datetime,
      timeFormat: 'HH:mm',
      dateFormat: 'DD.MM.YYYY',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    func: {
      ...InitialConfig.widgets.func,
      customProps: {
        showSearch: true,
      },
    },
    select: {
      ...InitialConfig.widgets.select,
    },
    multiselect: {
      ...InitialConfig.widgets.multiselect,
      customProps: {
        //showCheckboxes: false,
        width: '200px',
        input: {
          width: '100px',
        },
      },
    },
    treeselect: {
      ...InitialConfig.widgets.treeselect,
      customProps: {
        showSearch: true,
      },
    },
  };


  const types: Types = {
    ...InitialConfig.types,
    // examples of  overriding
    text: {
      ...InitialConfig.types.text,
      excludeOperators: ['proximity'],
    },
    boolean: merge({}, InitialConfig.types.boolean, {
      widgets: {
        boolean: {
          widgetProps: {
            hideOperator: true,
            operatorInlineLabel: 'is',
          },
          opProps: {
            equal: {
              label: 'is',
            },
            not_equal: {
              label: 'is not',
            },
          },
        },
      },
    }),
  };


  const localeSettings: LocaleSettings = {
    locale: {
      moment: 'CN',
      mui: muizhCN,
    },

    // theme: {
    // mui: {
    //   status: {
    //     danger: orange[500],
    //   },
    // },
    // },
    valueLabel: '值',
    valuePlaceholder: '输入值',
    fieldLabel: '字段',
    operatorLabel: '操作符',
    funcLabel: '函数',
    fieldPlaceholder: '输入字段',
    funcPlaceholder: '输入函数',
    operatorPlaceholder: '输入操作符',
    lockLabel: '锁定',
    lockedLabel: '已锁定',
    deleteLabel: '删除',
    addGroupLabel: '添加分组',
    addRuleLabel: '添加规则',
    addSubRuleLabel: '添加子规则',
    delGroupLabel: '删除分组',
    notLabel: '非',

    fieldSourcesPopupTitle: '字段资源类型',
    valueSourcesPopupTitle: '值资源类型',
    removeRuleConfirmOptions: {
      title: '确认删除这些规则吗?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
    },
    removeGroupConfirmOptions: {
      title: '确认删除这些规则组吗?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
    },
  };

  const settings: Settings = {
    ...InitialConfig.settings,
    ...localeSettings,

    defaultSliderWidth: '200px',
    defaultSelectWidth: '200px',
    defaultSearchWidth: '200px',
    defaultMaxRows: 5,

    valueSourcesInfo: {
      value: {
        label: 'Value',
      },
      field: {
        label: 'Field',
        widget: 'field',
      },
      func: {
        label: 'Function',
        widget: 'func',
      },
    },
    fieldSources: ['field', 'func'],
    keepInputOnChangeFieldSrc: true,
    // canReorder: true,
    // canRegroup: true,
    // showLock: true,
    // showNot: true,
    // showLabels: true,
    maxNesting: 5,
    canLeaveEmptyGroup: true,
    shouldCreateEmptyGroup: false,
    showErrorMessage: true,
    customFieldSelectProps: {
      showSearch: true,
    },
    //   renderConfirm: (props, ref) => {
    //   console.log(props, ref, 'renderConfirmcsacacascsacasc');
    //   return <>
    //     <Button size="sm" className={'mx-1'}>
    //       {props.label}
    //     </Button>
    //   </>;
    // },
    // renderField: (props, ref) => {
    //   console.log(props, ref, 'renderFieldcsacacascsacasc');
    //   return <>
    //     <Input size={'sm'} type="text" placeholder={props.placeholder} labelPlacement="outside" />
    //   </>;
    // },
    // renderConjs: (props, ref) => {
    //   console.log(props, ref, 'renderConjsrProvider');
    //
    //   // return <div className={'bg-default-100'}>
    //   //   {props.children}
    //   // </div>;
    // },
//     renderField: (props, ref) => {
//       console.log(props, ref, 'renderValueSources');
// return ref?.RCE
//       // return <div className={'bg-default-100'}>
//       //   {props.children}
//       // </div>;
//     },
//     renderProvider: (props, ref) => {
//       console.log(props, ref, 'renderProvider');
//
//       return <div className={'bg-default-100'}>
//         {props.children}
//       </div>;
//     },
//     renderButton: (props, ref) => {
//       console.log(props, ref, 'csacacascsacasc');
//       return <>
//         <Button size="sm" className={'mx-1'} onClick={props.onClick}>
//           {props.label}
//         </Button>
//       </>;
//     },
    // renderField: (props) => <FieldCascader {...props} />,
    // renderOperator: (props) => <FieldDropdown {...props} />,
    // renderFunc: (props) => <FieldSelect {...props} />,
    // maxNumberOfRules: 10 // number of rules can be added to the query builder
  };

  //////////////////////////////////////////////////////////////////////

  const fields: Fields = {
    // user: {
    //   label: 'User',
    //   tooltip: 'Group of fields',
    //   type: '!struct',
    //   subfields: {
    //     firstName: {
    //       label2: 'Username', //only for menu's toggler
    //       type: 'text',
    //       fieldSettings: {
    //         validateValue: (val, fieldSettings) => {
    //           return (val.length < 10);
    //         },
    //       } as TextFieldSettings,
    //       mainWidgetProps: {
    //         valueLabel: 'Name',
    //         valuePlaceholder: 'Enter name',
    //       },
    //     },
    //     login: {
    //       type: 'text',
    //       tableName: 't1', // legacy: PR #18, PR #20
    //       fieldSettings: {
    //         validateValue: (val, fieldSettings) => {
    //           return (val.length < 10 && (val === '' || val.match(/^[A-Za-z0-9_-]+$/) !== null));
    //         },
    //       } as TextFieldSettings,
    //       mainWidgetProps: {
    //         valueLabel: 'Login',
    //         valuePlaceholder: 'Enter login',
    //       },
    //     },
    //   },
    // },
    // bio: {
    //   label: 'Bio',
    //   type: 'text',
    //   preferWidgets: ['textarea'],
    //   fieldSettings: {
    //     maxLength: 1000,
    //   },
    // },
    results: {
      label: '集合数据源过滤',
      type: '!group',
      subfields: {
        product: {
          type: 'select',
          fieldSettings: {
            listValues: ['abc', 'def', 'xyz'],
          } as SelectFieldSettings,
          valueSources: ['value'],
        },
        score: {
          type: 'number',
          fieldSettings: {
            min: 0,
            max: 100,
          },
          valueSources: ['value'],
        },
      },
    },
    // cars: {
    //   label: 'Cars',
    //   type: '!group',
    //   mode: 'array',
    //   conjunctions: ['ANDs', 'OR'],
    //   showNot: true,
    //   operators: [
    //     // w/ operand - count
    //     'equal',
    //     'not_equal',
    //     'less',
    //     'less_or_equal',
    //     'greater',
    //     'greater_or_equal',
    //     'between',
    //     'not_between',
    //
    //     // w/o operand
    //     'some',
    //     'all',
    //     'none',
    //   ],
    //   defaultOperator: 'some',
    //   initialEmptyWhere: true, // if default operator is not in config.settings.groupOperators, true - to set no children, false - to add 1 empty
    //
    //   subfields: {
    //     vendor: {
    //       type: 'select',
    //       fieldSettings: {
    //         listValues: ['Ford', 'Toyota', 'Tesla'],
    //       } as MultiSelectFieldSettings,
    //       valueSources: ['value'],
    //     },
    //     year: {
    //       type: 'number',
    //       fieldSettings: {
    //         min: 1990,
    //         max: 2021,
    //       },
    //       valueSources: ['value'],
    //     },
    //   },
    // },
    // prox1: {
    //   label: 'prox',
    //   tooltip: 'Proximity search',
    //   type: 'text',
    //   operators: ['proximity'],
    // },
    // num: {
    //   label: 'Number',
    //   type: 'number',
    //   preferWidgets: ['number'],
    //   fieldSettings: {
    //     min: -1,
    //     max: 5,
    //   },
    //   funcs: ['number.LINEAR_REGRESSION'],
    // },
    // slider: {
    //   label: 'Slider',
    //   type: 'number',
    //   preferWidgets: ['slider', 'rangeslider'],
    //   valueSources: ['value', 'field'],
    //   fieldSettings: {
    //     min: 0,
    //     max: 100,
    //     step: 1,
    //     marks: {
    //       0: <strong>0%</strong>,
    //       100: <strong>100%</strong>,
    //     },
    //     validateValue: (val, fieldSettings) => {
    //       return (val < 50 ? null : 'Invalid slider value, see validateValue()');
    //     },
    //   } as NumberFieldSettings,
    //   //overrides
    //   widgets: {
    //     slider: {
    //       widgetProps: {
    //         valuePlaceholder: '..Slider',
    //       },
    //     },
    //     rangeslider: {
    //       widgetProps: {
    //         valueLabels: [
    //           { label: 'Number from', placeholder: 'from' },
    //           { label: 'Number to', placeholder: 'to' },
    //         ],
    //       },
    //     },
    //   },
    // },
    // date: {
    //   label: 'Date',
    //   type: 'date',
    //   valueSources: ['value'],
    //   fieldSettings: {
    //     dateFormat: 'DD-MM-YYYY',
    //     validateValue: (val, fieldSettings: DateTimeFieldSettings) => {
    //       // example of date validation
    //       const dateVal = moment(val, fieldSettings.valueFormat);
    //       return dateVal.year() != (new Date().getFullYear()) ? 'Please use current year' : null;
    //     },
    //   } as DateTimeFieldSettings,
    // },
    // time: {
    //   label: 'Time',
    //   type: 'time',
    //   valueSources: ['value'],
    //   defaultOperator: 'between',
    // },
    // datetime: {
    //   label: 'DateTime',
    //   type: 'datetime',
    //   valueSources: ['value', 'func'],
    // },
    // datetime2: {
    //   label: 'DateTime2',
    //   type: 'datetime',
    //   valueSources: ['field'],
    // },
    // color: {
    //   label: 'Color',
    //   type: 'select',
    //   valueSources: ['value'],
    //   fieldSettings: {
    //     showSearch: true,
    //     // * old format:
    //     // listValues: {
    //     //     yellow: 'Yellow',
    //     //     green: 'Green',
    //     //     orange: 'Orange'
    //     // },
    //     // * new format:
    //     listValues: [
    //       { value: 'yellow', title: 'Yellow' },
    //       { value: 'green', title: 'Green' },
    //       { value: 'orange', title: 'Orange' },
    //     ],
    //   },
    // },
    // color2: {
    //   label: 'Color2',
    //   type: 'select',
    //   fieldSettings: {
    //     listValues: {
    //       yellow: 'Yellow',
    //       green: 'Green',
    //       orange: 'Orange',
    //       purple: 'Purple',
    //     },
    //   },
    // },
    // multicolor: {
    //   label: 'Colors',
    //   type: 'multiselect',
    //   fieldSettings: {
    //     showSearch: true,
    //     listValues: {
    //       yellow: 'Yellow',
    //       green: 'Green',
    //       orange: 'Orange',
    //     },
    //     allowCustomValues: true,
    //   },
    // },
    // selecttree: {
    //   label: 'Color (tree)',
    //   type: 'treeselect',
    //   fieldSettings: {
    //     treeExpandAll: true,
    //     // * deep format (will be auto converted to flat format):
    //     // treeValues: [
    //     //     { value: "1", title: "Warm colors", children: [
    //     //         { value: "2", title: "Red" },
    //     //         { value: "3", title: "Orange" }
    //     //     ] },
    //     //     { value: "4", title: "Cool colors", children: [
    //     //         { value: "5", title: "Green" },
    //     //         { value: "6", title: "Blue", children: [
    //     //             { value: "7", title: "Sub blue", children: [
    //     //                 { value: "8", title: "Sub sub blue and a long text" }
    //     //             ] }
    //     //         ] }
    //     //     ] }
    //     // ],
    //     // * flat format:
    //     treeValues: [
    //       { value: '1', title: 'Warm colors' },
    //       { value: '2', title: 'Red', parent: '1' },
    //       { value: '3', title: 'Orange', parent: '1' },
    //       { value: '4', title: 'Cool colors' },
    //       { value: '5', title: 'Green', parent: '4' },
    //       { value: '6', title: 'Blue', parent: '4' },
    //       { value: '7', title: 'Sub blue', parent: '6' },
    //       { value: '8', title: 'Sub sub blue and a long text', parent: '7' },
    //     ],
    //   },
    // },
    // multiselecttree: {
    //   label: 'Colors (tree)',
    //   type: 'treemultiselect',
    //   fieldSettings: {
    //     treeExpandAll: true,
    //     treeValues: [
    //       {
    //         value: '1', title: 'Warm colors', children: [
    //           { value: '2', title: 'Red' },
    //           { value: '3', title: 'Orange' },
    //         ],
    //       },
    //       {
    //         value: '4', title: 'Cool colors', children: [
    //           { value: '5', title: 'Green' },
    //           {
    //             value: '6', title: 'Blue', children: [
    //               {
    //                 value: '7', title: 'Sub blue', children: [
    //                   { value: '8', title: 'Sub sub blue and a long text' },
    //                 ],
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
    // autocomplete: {
    //   label: 'Autocomplete',
    //   type: 'select',
    //   valueSources: ['value'],
    //   fieldSettings: {
    //     asyncFetch: simulatedAsyncFetch,
    //     useAsyncSearch: true,
    //     useLoadMore: true,
    //     forceAsyncSearch: false,
    //     allowCustomValues: false,
    //   } as SelectFieldSettings,
    // },
    // autocompleteMultiple: {
    //   label: 'AutocompleteMultiple',
    //   type: 'multiselect',
    //   valueSources: ['value'],
    //   fieldSettings: {
    //     asyncFetch: simulatedAsyncFetch,
    //     useAsyncSearch: true,
    //     useLoadMore: true,
    //     forceAsyncSearch: false,
    //     allowCustomValues: false,
    //   } as SelectFieldSettings,
    // },
    // stock: {
    //   label: 'In stock',
    //   type: 'boolean',
    //   defaultValue: true,
    //   mainWidgetProps: {
    //     labelYes: '+',
    //     labelNo: '-',
    //   },
    // },
  };

  //////////////////////////////////////////////////////////////////////

  const funcs: Funcs = {
    //...BasicFuncs
    string: {
      type: '!struct',
      label: 'String',
      subfields: {
        LOWER: merge({}, BasicFuncs.LOWER, {
          allowSelfNesting: true,
        }),
        UPPER: merge({}, BasicFuncs.UPPER, {
          allowSelfNesting: true,
        }),
      },
    },
    date: {
      type: '!struct',
      label: 'Date',
      subfields: {
        NOW: BasicFuncs.NOW,
        RELATIVE_DATETIME: merge({}, BasicFuncs.RELATIVE_DATETIME, {
          args: {
            date: {
              defaultValue: { func: 'date.NOW', args: [] },
            },
          },
        }),
      },
    },
    number: {
      type: '!struct',
      label: 'Number',
      subfields: {
        LINEAR_REGRESSION: BasicFuncs.LINEAR_REGRESSION,
      },
    },
  };

  const ctx = InitialConfig.ctx;

  const config: Config = {
    ctx,
    conjunctions,
    operators,
    widgets,
    types,
    settings,
    fields,
    funcs,
  };

  return config;
};
