import { memo, useCallback, useState } from "react";
import { AInput } from "../comp/AInput";
import { MenuContent } from "./content";
import {
  Button,
  Divider,
  Modal,
  Input,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
  ModalFooter,
} from "@nextui-org/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  updateDuration,
  updateIndexList,
} from "../store/slice/configSlice";
import { DEMO_CAROUSEL_LOCALSTORAGE_CAROUSEL } from "../contant";
import { toSetLocalstorage } from "../struct/toJSON";
import { useTakeConfig } from "../comp/useTakeStore";

const IntervalContent = memo(() => {
  const ConfigState = useTakeConfig()
  const dispatch = useDispatch();
  const [characters, updateCharacters] = useState<
    { id: string; name: string; img?: string }[]
  >([]);

  const onSelection = useCallback(
    (e: string[]) => {
      const finalSpaceCharacters =
        ConfigState.contentList?.records
          .filter((f) => e.includes(f.viewId))
          .map((rec) => ({
            id: rec.viewId,
            name: rec.viewName,
            img: rec.img,
          })) || [];
      updateCharacters(finalSpaceCharacters);
      dispatch(updateIndexList(finalSpaceCharacters));
    },
    [ConfigState.contentList?.records, dispatch]
  );

  const handleOnDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const items = Array.from(characters || []);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      updateCharacters(items);
      dispatch(updateIndexList(items));
    },
    [characters, dispatch]
  );

  const onHandleChangeDuration = useCallback(
    (e: string) => {
      dispatch(updateDuration(Number(e) || 1000));
    },
    [dispatch]
  );

  return (
    <>
      <small>筛选</small>
      <Select
        items={ConfigState.contentList?.records || []}
        variant="bordered"
        isMultiline={true}
        size="sm"
        aria-label="c"
        selectionMode="multiple"
        labelPlacement="outside"
        placeholder="筛选即将轮播的素材"
        classNames={{
          base: "",
          trigger: "",
        }}
        onSelectionChange={(e) => {
          onSelection([...e] as string[]);
        }}
      >
        {(item) => (
          <SelectItem key={item.viewId} textValue={item.viewName}>
            <div className="flex gap-2 items-center">
              <div className="flex flex-col">
                <span className="text-small">{item.viewName}</span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
      <Divider className="mt-2"></Divider>
      <small>排序</small>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="characters">
          {(provided) => (
            <ul
              className="characters"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {characters?.map(({ id, name, img }, index) => {
                return (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="border-1 my-1 p-1 flex"
                      >
                        <div className="px-1 rounded-sm mr-1">
                          <span>NO</span>
                          <span className="bg-slate-300 px-1 mx-1">
                            {index}
                          </span>
                        </div>
                        {img ? <img src={img} alt="" className="w-[100px] p-1"/> : <></>}
                        <p className="text-[12px] flex items-center pl-1">
                          <span>{name}</span>
                        </p>
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <Divider className="mt-2"></Divider>
      <small>切换时常</small>
      <Input
        size="sm"
        value={String(ConfigState.duration)}
        aria-label="ca"
        variant="bordered"
        labelPlacement="outside"
        placeholder="输入有效间隔事件,单位秒"
        onChange={(e) => {
          onHandleChangeDuration(e.target.value);
        }}
      ></Input>
    </>
  );
});

export const Proj = memo(() => {
  const nav = useNavigate();
  const ConfigState = useTakeConfig()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onHandleCreate = useCallback(() => {
    nav("/panel");
  }, [nav]);

  const onHandleInterval = useCallback(() => {
    onOpen();
  }, [onOpen]);

  const onToPreviewInterval = useCallback(() => {
    ConfigState.contentList?.records.map((rec) => {
      toSetLocalstorage(
        rec.viewName,
        DEMO_CAROUSEL_LOCALSTORAGE_CAROUSEL,
        rec.webNodes,
        rec.webPanel,
        rec.webLogic
      );
    });

    window.open(
      window.location.origin +
        "/demo?work=" +
        JSON.stringify({
          indexList: ConfigState.indexList.map((k) => k.name),
          duration: ConfigState.duration,
        })
    );
  }, [
    ConfigState.contentList?.records,
    ConfigState.duration,
    ConfigState.indexList,
  ]);

  return (
    <div>
      <div className="flex mb-4 justify-between">
        <div>
          <Button color="primary" size="sm" onClick={onHandleCreate}>
            新建
          </Button>
          <Button
            isDisabled={!ConfigState.contentList?.records?.length}
            color="primary"
            className="ml-1"
            size="sm"
            onClick={onHandleInterval}
          >
            轮播
          </Button>
        </div>
        <div className="flex">
          <AInput placeholder="搜索" className="w-[250px] mr-2" size="xs" />
          <Button color="primary" size="sm">
            搜索
          </Button>
        </div>
      </div>
      <MenuContent></MenuContent>
      <Modal
        size={"2xl"}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => {
            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  轮播顺序
                </ModalHeader>
                <div className="h-[400px] p-[20px]">
                  <IntervalContent></IntervalContent>
                </div>
                <ModalFooter>
                  <Button
                    color="primary"
                    variant="light"
                    onPress={() => {
                      onClose();
                      onToPreviewInterval();
                    }}
                  >
                    前往
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </div>
  );
});
