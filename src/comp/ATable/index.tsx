import './index.css';
import {
  Cell,
  ColumnDef,
  Header,
  flexRender,
  getCoreRowModel,
  Table,
  useReactTable,
} from '@tanstack/react-table';
import { makeData, Person } from './makeData';

import {
  DndContext,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CSSProperties, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateDraggable } from '../../store/slice/widgetSlice.ts';

const DraggableTableHeader = <T, >({
                                     header,
                                     table,
                                   }: {
  header: Header<Person, unknown>,
  table: Table<T>
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });
  const dispatch = useDispatch();
  const resizeStart = useCallback(() => {
    dispatch(updateDraggable(false));
    return header.getResizeHandler();
  }, [header]);

  const mouseUpDefaultSetDraggable = useCallback(() => {
    dispatch(updateDraggable(true));
  }, []);

  useEffect(() => {
    window.addEventListener('mouseup', mouseUpDefaultSetDraggable, false);
    return () => {
      window.removeEventListener('mouseup', mouseUpDefaultSetDraggable);
    };
  }, [mouseUpDefaultSetDraggable]);

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: 'width transform 0.2s ease-in-out',
    whiteSpace: 'nowrap',
    width: header.getSize(),
    zIndex: isDragging ? 1000 : 0,
  };
  console.log(header.getSize(), 'listeners');
  return (

    <div
      ref={setNodeRef}
      {...{
        colSpan: header.colSpan,
        key: header.id,
        className: 'th',
        style: style,
      }}
    >
       <span  {...attributes}
              {...listeners}>

    {header.isPlaceholder
      ? null
      : flexRender(header.column.columnDef.header, header.getContext())}
        </span>

      <div
        {...{
          onMouseDown: resizeStart(),
          onTouchStart: resizeStart(),
          className: `w-[4px] resizer ${
            table.options.columnResizeDirection
          } ${
            header.column.getIsResizing() ? 'isResizing' : ''
          }`,
        }}
      >
      </div>
    </div>
  )
    ;
};

const DragAlongCell = ({ cell }: { cell: Cell<Person, unknown> }) => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: 'width transform 0.2s ease-in-out',
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div style={style} ref={setNodeRef}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  );
};

export const ATable = memo(() => {
  const dispatch = useDispatch();
  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        cell: info => info.getValue(),
        id: 'firstName',

      },
      {
        accessorFn: row => row.lastName,
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        id: 'lastName',

      },
      {
        accessorKey: 'age',
        header: () => 'Age',
        id: 'age',


      },
      {
        accessorKey: 'visits',
        header: () => <span>Visits</span>,
        id: 'visits',


      },
      {
        accessorKey: 'status',
        header: 'Status',
        id: 'status',


      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        id: 'progress',

      },
    ],
    [],
  );
  const [data, setData] = useState(() => makeData(20));
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    columns.map(c => c.id!),
  );
  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnOrder,
    },
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
    onColumnOrderChange: setColumnOrder,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  const handleDragStart = useCallback(() => {
    dispatch(updateDraggable(false));
  }, []);


  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    console.log(event, 'event');
    if (active && over && active.id !== over.id) {
      setColumnOrder(columnOrder => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
    dispatch(updateDraggable(true));
  }, []);
  // reorder columns after drag & drop


  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div>
        <table
          style={{
            //width: table.getCenterTotalSize(),
            width: table.getCenterTotalSize(),
          }}
        >
          <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <div
              {...{
                key: headerGroup.id,
                className: 'tr',
              }}
            >
              <SortableContext
                items={columnOrder}
                strategy={horizontalListSortingStrategy}
              >
                {headerGroup.headers.map(header => (
                  <DraggableTableHeader key={header.id} header={header} table={table} />
                ))}
              </SortableContext>
            </div>

          ))}
          </thead>
          <tbody>
          {table.getRowModel().rows.map(row => (
            <div
              {...{
                key: row.id,
                className: 'tr',
              }}
            >
              {row.getVisibleCells().map(cell => (
                <SortableContext
                  key={cell.id}
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  <DragAlongCell key={cell.id} cell={cell} />
                </SortableContext>
              ))}
            </div>

          ))}
          </tbody>
        </table>
      </div>
    </DndContext>
  );
});
