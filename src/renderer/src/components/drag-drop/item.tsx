import { COLORS } from '@shared/constants'
import { droppableItem } from './drag-drop'

type ItemProps = {
  item: droppableItem
  isHorizontal?: boolean
  isNotIndex?: boolean
  dragOverlay?: boolean
  index: number
}

const Item = ({
  item,
  dragOverlay,
  index,
  isNotIndex = false,
  isHorizontal = false
}: ItemProps) => {
  return (
    <div
      style={{
        width: 120,
        cursor: dragOverlay ? 'grabbing' : 'grab',
        alignItems: 'center',
        boxSizing: 'border-box',
        fontSize: '10px',
        margin: '0',
        marginBottom: isHorizontal ? 0 : '4px',
        padding: '2px 4px',
        border: '1px solid gray',
        borderRadius: '10px',
        backgroundColor: isNotIndex ? '#Eef0f0' : COLORS[index],
        opacity: isNotIndex ? 1 : 0.7,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: 'black'
      }}
    >
      {item.name}
    </div>
  )
}

export default Item
