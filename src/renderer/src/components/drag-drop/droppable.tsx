import * as React from 'react'
import { GrafContext } from '@/context/GraftContext'
import { useDroppable } from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import { cn } from '@/utils'

import { droppableItem } from './drag-drop'
import SortableItem from './sortable-item'

type DroppableProps = {
  id: string
  items: droppableItem[]
  isHorizontal?: boolean
  name: string
  isNotIndex?: boolean
}

const Droppable = ({
  id,
  items,
  isHorizontal = false,
  name,
  isNotIndex = false
}: DroppableProps) => {
  const { setNodeRef, over, active } = useDroppable({ id })
  const {
    graftState: { drawerOpen }
  } = React.useContext(GrafContext)

  const isHovering = over?.id === id || over?.data?.current?.sortable?.containerId === id

  const title = (
    <h6
      style={{
        marginLeft: isHorizontal ? 8 : undefined,
        marginTop: 0,
        marginBottom: 0,
        padding: 0,
        width: isHorizontal ? 20 : 120,
        display: 'block',
        borderBottom: '1px solid'
      }}
    >
      {name}
    </h6>
  )

  return (
    <div
      className={cn(
        'mr-0.5 flex max-h-[87vh] flex-col items-center justify-start border p-0',
        isHorizontal && 'mb-0.5 max-w-full flex-row',
        active && isHorizontal && !isHovering && 'border border-yellow-300',
        active && isHovering && 'border border-blue-300'
      )}
    >
      <>{title}</>

      <div
        ref={setNodeRef}
        className={cn(
          'flex h-full w-full flex-col flex-wrap items-start justify-start overflow-auto p-0 pl-1 pr-1 pt-0',
          isHorizontal && 'mb-0.5 mr-0 flex-row items-center justify-center pr-0 pt-2'
        )}
      >
        <SortableContext id={id} items={items.map((d) => d.name)} strategy={rectSortingStrategy}>
          {items?.length > 0 ? (
            <div
              className={cn(
                'flex flex-col items-center gap-1 overflow-auto',
                isHorizontal && 'w-full flex-row'
              )}
            >
              {items.map((item, i) => (
                <React.Fragment key={item.name}>
                  {over?.data?.current?.sortable?.index === i &&
                    over?.data?.current?.sortable?.containerId === id && (
                      <div
                        style={{
                          display: isHorizontal ? 'block' : 'none',
                          borderBottom: '5px solid transparent',
                          borderTop: '5px solid transparent',
                          borderRight: '5px solid red',
                          width: 0,
                          height: 0
                        }}
                      />
                    )}
                  <SortableItem
                    isNotIndex={isNotIndex}
                    isHorizontal={isHorizontal}
                    key={item.name}
                    item={item}
                  />
                  {items.length - i <= 1 &&
                    over?.data?.current === undefined &&
                    over?.id === id && (
                      <div
                        style={{
                          display: isHorizontal ? 'block' : 'none',
                          width: 0,
                          height: 0,
                          borderBottom: '5px solid transparent',
                          borderTop: '5px solid transparent',
                          borderRight: '5px solid red'
                        }}
                      />
                    )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <h6 className="w-full text-center" {...(!isHorizontal && { style: { marginTop: 50 } })}>
              {id === 'columns' ? 'Not CSV file Selected' : 'Drop here'}
            </h6>
          )}
        </SortableContext>
      </div>
    </div>
  )
}

export default Droppable
