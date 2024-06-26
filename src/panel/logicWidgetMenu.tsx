import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { WidgetIconTemp } from "./widgetIconTemp";
import { memo } from "react";
import { ITs } from "./widgetMenu.tsx";
import { genLogicNodeMenuItems } from "../Logic/base.ts";

const CacheMap = memo(() => {
  const cache = genLogicNodeMenuItems();

  return (
    <div className="space-y-2">
      {cache.logicNodeMenuItems.get("cache")?.map((cache) => {
        return (
          <div key={cache.id}>
            <WidgetIconTemp
              tips={cache.tips}
              nodeType="LOGIC"
              classify="cache"
              typeId={cache.id}
              src={cache.src}
              name={cache.name}
            ></WidgetIconTemp>
          </div>
        );
      })}
    </div>
  );
});

const MixMap = memo(() => {
  const mix = genLogicNodeMenuItems();
  return (
    <div className="space-y-2">
      {mix.logicNodeMenuItems.get("mix")?.map((filter) => {
        return (
          <div key={filter.id}>
            <WidgetIconTemp
              tips={filter.tips}
              nodeType="LOGIC"
              classify="mix"
              typeId={filter.id}
              src={filter.src}
              name={filter.name}
            ></WidgetIconTemp>
          </div>
        );
      })}
    </div>
  );
});

const FilterMap = memo(() => {
  const filter = genLogicNodeMenuItems();
  return (
    <div className="space-y-2">
      {filter.logicNodeMenuItems.get("filter")?.map((filter) => {
        return (
          <div key={filter.id}>
            <WidgetIconTemp
              tips={filter.tips}
              nodeType="LOGIC"
              classify="filter"
              typeId={filter.id}
              src={filter.src}
              name={filter.name}
            ></WidgetIconTemp>
          </div>
        );
      })}
    </div>
  );
});

const TimeInterMap = memo(() => {
  const TimeInter = genLogicNodeMenuItems();
  return (
    <div className="space-y-2">
      {TimeInter.logicNodeMenuItems.get("timeInter")?.map((remote) => {
        return (
          <div key={remote.id}>
            <WidgetIconTemp
              tips={remote.tips}
              nodeType="LOGIC"
              classify="timeInter"
              typeId={remote.id}
              src={remote.src}
              name={remote.name}
            ></WidgetIconTemp>
          </div>
        );
      })}
    </div>
  );
});

const ClickMap = memo(() => {
  return <></>;
});

const BatterMap = memo(() => {
  return <></>;
});

const HandleForm = memo(() => {
  return <></>;
});

const HandleTrigger = memo(() => {
  const HTrigger = genLogicNodeMenuItems();
  return (
    <div className="space-y-2">
      {HTrigger.logicNodeMenuItems.get("hTrigger")?.map((remote) => {
        return (
          <div key={remote.id}>
            <WidgetIconTemp
              tips={remote.tips}
              nodeType="LOGIC"
              classify="hTrigger"
              typeId={remote.id}
              src={remote.src}
              name={remote.name}
            ></WidgetIconTemp>
          </div>
        );
      })}
    </div>
  );
});

const TimeSlotMap = memo(() => {
  const TimeSlot = genLogicNodeMenuItems();
  const type = "date";
  return (
    <div className="space-y-2">
      {TimeSlot.logicNodeMenuItems.get(type)?.map((item) => {
        return (
          <div key={item.id}>
            <WidgetIconTemp
              tips={item.tips}
              nodeType="LOGIC"
              classify={type}
              typeId={item.id}
              src={item.src}
              name={item.name}
            ></WidgetIconTemp>
          </div>
        );
      })}
    </div>
  );
});

const PageSlotMap = memo(() => {
  const PageSlot = genLogicNodeMenuItems();
  const type = "page";
  return (
    <div className="space-y-2">
      {PageSlot.logicNodeMenuItems.get(type)?.map((item) => {
        return (
          <div key={item.id}>
            <WidgetIconTemp
              tips={item.tips}
              nodeType="LOGIC"
              classify={type}
              typeId={item.id}
              src={item.src}
              name={item.name}
            ></WidgetIconTemp>
          </div>
        );
      })}
    </div>
  );
});
const LogicBoth = memo(() => {
  const LogicSlot = genLogicNodeMenuItems();
  return (
    <div className="space-y-2">
      {LogicSlot.logicNodeMenuItems.get("both")?.map((item) => {
        return (
          <div key={item.id}>
            <WidgetIconTemp
              tips={item.tips}
              nodeType="LOGIC"
              classify="both"
              typeId={item.id}
              src={item.src}
              name={item.name}
            ></WidgetIconTemp>
          </div>
        );
      })}
    </div>
  );
});
const ViewSlotMap = memo(() => {
  const ViewSlot = genLogicNodeMenuItems();
  return (
    <div className="space-y-2">
      {ViewSlot.logicNodeMenuItems.get("viewSlot")?.map((remote) => {
        return (
          <div key={remote.id}>
            <WidgetIconTemp
              tips={remote.tips}
              nodeType="LOGIC"
              classify="viewSlot"
              typeId={remote.id}
              src={remote.src}
              name={remote.name}
            ></WidgetIconTemp>
          </div>
        );
      })}
    </div>
  );
});

const TimeOutMap = memo(() => {
  const TimeOut = genLogicNodeMenuItems();
  return (
    <div className="space-y-2">
      {TimeOut.logicNodeMenuItems.get("timeOut")?.map((remote) => {
        return (
          <div key={remote.id}>
            <WidgetIconTemp
              tips={remote.tips}
              nodeType="LOGIC"
              classify="timeOut"
              typeId={remote.id}
              src={remote.src}
              name={remote.name}
            ></WidgetIconTemp>
          </div>
        );
      })}
    </div>
  );
});

const RemoteMap = memo(() => {
  const remote = genLogicNodeMenuItems();

  return (
    <div className="space-y-2">
      {remote.logicNodeMenuItems.get("remote")?.map((remote) => {
        return (
          <div key={remote.id}>
            <WidgetIconTemp
              tips={remote.tips}
              nodeType="LOGIC"
              classify="remote"
              typeId={remote.id}
              src={remote.src}
              name={remote.name}
            ></WidgetIconTemp>
          </div>
        );
      })}
    </div>
  );
});
const LogicDebugger = [
  {
    id: "logic_deb_trigger",
    label: "触发",
    content: <HandleTrigger></HandleTrigger>,
  },
  {
    id: "logic_form_trigger",
    label: "表单",
    content: <HandleForm></HandleForm>,
  },
  {
    id: "logic_log_trigger",
    label: "日志",
    content: <HandleForm></HandleForm>,
  },
];
const LogicBrowse = [
  {
    id: "logic_batter_slot",
    label: "电量",
    content: <BatterMap></BatterMap>,
  },
  {
    id: "logic_play_slot",
    label: "音频",
    content: <BatterMap></BatterMap>,
  },
  {
    id: "logic_net_slot",
    label: "网络",
    content: <BatterMap></BatterMap>,
  },
  {
    id: "logic_web_slot",
    label: "标签",
    content: <BatterMap></BatterMap>,
  },
];
const LogicEvent = [
  {
    id: "logic_mouse_slot",
    label: "鼠标",
    content: <ClickMap></ClickMap>,
  },
  {
    id: "logic_key_slot",
    label: "键盘",
    content: <ClickMap></ClickMap>,
  },
  {
    id: "logic_window_slot",
    label: "窗口",
    content: <ClickMap></ClickMap>,
  },
];
const LogicLife = [
  {
    id: "logic_page_slot",
    label: "生命",
    content: <PageSlotMap></PageSlotMap>,
  },
  {
    id: "logic_time_slot",
    label: "时间",
    content: <TimeSlotMap></TimeSlotMap>,
  },
];
const LogicView = [
  {
    id: "logic_view_slot",
    label: "插槽",
    content: <ViewSlotMap></ViewSlotMap>,
  },
  {
    id: "logic_file_base",
    label: "文件",
    content: <></>,
  },
  {
    id: "logic_view_base",
    label: "门",
    content: <LogicBoth></LogicBoth>,
  },
];
const LogicTime = [
  {
    id: "logic_time_out",
    label: "定时",
    content: <TimeOutMap></TimeOutMap>,
  },
  {
    id: "logic_time_inter",
    label: "频发",
    content: <TimeInterMap></TimeInterMap>,
  },
];
const LogicData = [
  {
    id: "logic_remote_data",
    label: "远程",
    content: <RemoteMap></RemoteMap>,
  },
  {
    id: "logic_cache_data",
    label: "缓存",
    content: <CacheMap></CacheMap>,
  },
  {
    id: "logic_filter_data",
    label: "过滤",
    content: <FilterMap></FilterMap>,
  },
  {
    id: "logic_mix_data",
    label: "装饰",
    content: <MixMap></MixMap>,
  },
];

const TabSlot = memo(({ ele }: ITs) => {
  return (
    <div className="flex h-[100%]">
      <Tabs
        aria-label="Dynamic tabs"
        items={ele}
        color="primary"
        radius="none"
        classNames={{
          tabList: "flex flex-col",
          panel: "p-0 bg-default-100 h-[100%] w-[100%]",
          cursor: "rounded-md",
          base: "bg-default-100",
        }}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            <Card className="rounded-none h-[100%]">
              <CardBody>{item.content}</CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
});

const EventIcon = memo(() => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path
            fill="currentColor"
            d="M15 15h1a4 4 0 0 1 4 4a2 2 0 0 1-2 2H8.132a2 2 0 0 1-1.715-.971l-2.194-3.657A1.566 1.566 0 0 1 5.566 14H6a2 2 0 0 1 1.6.8L10 18V9a2 2 0 1 1 4 0v5a1 1 0 0 0 1 1"
          />
          <path d="M12 4V3m6 7h1M5 10h1m1.343-4.657l-.707-.707m10.021.707l.707-.707" />
        </g>
      </svg>
      <span className="text-center">事件</span>
    </div>
  );
});
const LifeIcon = memo(() => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M7.85 21.125q-2.6-1.2-4.225-3.625T2 12.025q0-.65.063-1.275t.212-1.225l-1.15.675l-1-1.725L4.9 5.725l2.75 4.75l-1.75 1l-1.35-2.35q-.275.675-.412 1.4T4 12.025q0 2.425 1.325 4.413t3.525 2.937zM15.5 9V7h2.725q-1.15-1.425-2.775-2.212T12 4q-1.375 0-2.6.425t-2.25 1.2l-1-1.75Q7.4 3 8.875 2.5T12 2q1.975 0 3.775.738T19 4.874V3.5h2V9zm-.65 15l-4.775-2.75l2.75-4.75l1.725 1l-1.425 2.45q2.95-.425 4.913-2.675T20 12q0-.275-.012-.513T19.925 11h2.025q.025.25.038.488T22 12q0 3.375-2.013 6.038t-5.237 3.587l1.1.65z"
        />
      </svg>
      <span className="text-center">周期</span>
    </div>
  );
});

const ViewIcon = memo(() => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 56 56"
      >
        <path
          fill="currentColor"
          d="M2.024 44.969h19.334c1.186 0 1.93-.745 1.93-1.885c0-1.117-.744-1.861-1.93-1.861H5.863v-.117l9.097-8.84c5.537-5.375 7.165-8.167 7.165-11.75c0-5.327-4.722-9.399-11.027-9.399c-4.956 0-9.19 2.676-10.61 6.77C.21 18.68.1 19.33.1 19.912c0 1.163.691 1.93 1.831 1.93c1.094 0 1.559-.511 1.908-1.674c.186-.722.442-1.373.814-1.978c1.233-2.07 3.537-3.397 6.445-3.397c3.769 0 6.77 2.653 6.77 5.956c0 2.676-1.093 4.49-5.7 9.027L1.28 40.595C.303 41.572 0 42.154 0 43.015c0 1.21.791 1.954 2.024 1.954m27.989-.047h9.538C49.974 44.922 56 38.71 56 28.217c0-10.492-6.026-16.565-16.449-16.565h-9.539c-1.28 0-2.093.838-2.093 2.14v28.966c0 1.326.814 2.164 2.093 2.164m2.117-3.815V15.42h7.119c8.003 0 12.447 4.654 12.447 12.82c0 8.212-4.444 12.865-12.447 12.865Z"
        />
      </svg>
      <span className="text-center">应用</span>
    </div>
  );
});
const TimeIcon = memo(() => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <g fill="none">
          <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
          <path
            fill="currentColor"
            d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1"
          />
        </g>
      </svg>
      <span className="text-center">定时器</span>
    </div>
  );
});
const LogicDataIcon = memo(() => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 7c0 2.21-4.03 4-9 4S3 9.21 3 7m18 0c0-2.21-4.03-4-9-4S3 4.79 3 7m18 0v5M3 7v5m18 0c0 2.21-4.03 4-9 4s-9-1.79-9-4m18 0v5c0 2.21-4.03 4-9 4s-9-1.79-9-4v-5"
        />
      </svg>
      <span className="text-center">数据</span>
    </div>
  );
});

const DebuggerIcon = memo(() => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 14 14"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3.5 10.5l1.3-1.3M4.5 7H3m7.5-3.5L9.2 4.8M9.5 7H11m-4.5-.5h3M.5 7a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0-13 0m11.096 4.596L2.404 2.404" />
          <path d="M4.804 4.804A2.5 2.5 0 0 1 9.5 6v2a2.5 2.5 0 0 1-.304 1.196M4.5 7v1a2.5 2.5 0 0 0 3.172 2.408" />
        </g>
      </svg>

      <span className="text-center">调试</span>
    </div>
  );
});

const BrowseIcon = memo(() => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M0 20v-2h2V3h20v15h2v2zm10-2h4v-1h-4zm-6-3h16V5H4zm8-5"
        />
      </svg>
      <span className="text-center">浏览器</span>
    </div>
  );
});

const tabs = [
  {
    id: "data_logic",
    label: <LogicDataIcon />,
    content: <TabSlot ele={LogicData}></TabSlot>,
  },
  {
    id: "time_logic",
    label: <TimeIcon />,
    content: <TabSlot ele={LogicTime}></TabSlot>,
  },
  {
    id: "view_logic",
    label: <ViewIcon />,
    content: <TabSlot ele={LogicView}></TabSlot>,
  },
  {
    id: "life_logic",
    label: <LifeIcon />,
    content: <TabSlot ele={LogicLife}></TabSlot>,
  },
  {
    id: "event_logic",
    label: <EventIcon />,
    content: <TabSlot ele={LogicEvent}></TabSlot>,
  },
  {
    id: "browse_logic",
    label: <BrowseIcon />,
    content: <TabSlot ele={LogicBrowse}></TabSlot>,
  },
  {
    id: "debugger_logic",
    label: <DebuggerIcon />,
    content: <TabSlot ele={LogicDebugger}></TabSlot>,
  },
];

export const LogicWidgetMenu = memo(() => {
  return (
    <div className="flex h-[calc(100%_-_44px)]">
      <Tabs
        aria-label="Dynamic tabs"
        color="primary"
        items={tabs}
        radius="none"
        classNames={{
          tab: "h-[70px]",
          tabList: "flex flex-col",
          panel: "p-0 bg-default-100 h-[100%] w-[100%]",
          cursor: "rounded-md",
          base: "bg-default-100",
        }}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            <Card className="rounded-none h-[100%]">
              <CardBody className="p-0">{item.content}</CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
});
