import * as React from 'react'

import { cn } from '@/utils'

type ListProps = React.PropsWithChildren & {
  className?: string
}

const List = React.forwardRef<HTMLUListElement, ListProps>((props, ref) => {
  const { className, children, ...rest } = props
  return (
    <ul
      ref={ref as React.RefObject<HTMLUListElement>}
      className={cn('flex w-full flex-col', className)}
      {...rest}
    >
      {children}
    </ul>
  )
})

export default List
