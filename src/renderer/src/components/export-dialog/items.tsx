import { cn } from '@renderer/utils'
import { Checkbox } from '../ui/checkbox'

type ColumProps = {
  id: string
  idPrefix?: string
  name: string
  isSelected: boolean
  className?: string
  color?: string
  setChecked: (id: string, c: boolean) => void
}
const SelectedItem = (props: ColumProps) => {
  const { name, id, idPrefix = '', isSelected, className, setChecked, color, ...rest } = props
  const customId = `${idPrefix}${id}`
  return (
    <li
      className={cn(
        className,
        'flex max-w-[220px] select-none items-center space-x-2 px-2 hover:bg-secondary rounded-md cursor-pointer hover:right-1  hover:ring-secondary/25',
        isSelected && 'bg-secondary/50 shadow-md ring-1 ring-primary/15'
      )}
      onClick={() => setChecked(id, !isSelected)}
      {...rest}
    >
      <Checkbox id={customId} checked={isSelected} />
      <label
        id={customId}
        className={cn(
          'ml-2 cursor-pointer w-full overflow-hidden truncate font-extrabold hover:text-ellipsis m-1'
        )}
        style={{ color: `color-mix(in srgb, ${color} 20%, ${color})` }}
      >
        {name}
      </label>
    </li>
  )
}

export default SelectedItem
