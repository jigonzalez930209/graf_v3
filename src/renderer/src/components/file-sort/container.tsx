import * as React from 'react'

import { cn } from '@/utils'

import { ScrollArea, ScrollBar } from '../ui/scroll-area'

type ContainerProps = React.PropsWithChildren & {
  className?: string
  maxHeight?: string
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>((props, ref) => {
  const { className, maxHeight, children, ...rest } = props

  return (
    <div className="min-w-[245px] text-sm ">
      <ScrollArea
        ref={ref}
        className={cn(className, maxHeight || 'max-h-[calc(100vh)]')}
        viewPortClassName={maxHeight}
        {...rest}
      >
        {children}
        <ScrollBar orientation="vertical" className={cn(maxHeight || 'max-h-[calc(100vh)]')} />
      </ScrollArea>
    </div>
  )
})

export default Container
