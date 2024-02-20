import { cn } from '@renderer/utils'

type ColumProps = {
  label: string
  isSelected: boolean
  className?: string
  setChecked: (label: string) => void
}
const ListItem = (props: ColumProps) => {
  const { label, isSelected, className, setChecked, ...rest } = props

  return (
    <li
      className={cn(
        className,
        'flex w-full select-none items-center px-2 hover:bg-secondary-foreground/5 rounded-md cursor-pointer',
        isSelected && 'bg-secondary/50 shadow-md ring-1 ring-primary/15'
      )}
      onClick={() => setChecked(label)}
      {...rest}
    >
      <div
        className={cn(
          'ml-2 cursor-pointer w-full overflow-hidden truncate font-extrabold hover:text-ellipsis m-1'
        )}
      >
        {label}
      </div>
    </li>
  )
}

export default ListItem
