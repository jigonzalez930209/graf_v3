import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/utils'

import { Button } from './button'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 20, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md  fade-in-0 zoom-in-95',
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export type CustomTooltipProps = {
  title: string
  Icon?: React.ReactNode
  content?: string
  children?: JSX.Element
  className?: string
  onClick?: () => void
}

const CustomTooltip = (props: CustomTooltipProps) => {
  const { title, Icon, content, children, onClick, className } = props
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <div
            className=" flex items-center justify-center rounded-full p-2 hover:ring-1 hover:ring-primary/20 hover:shadow-md hover:bg-primary/10 transition-all duration-100"
            onClick={onClick}
          >
            {!!Icon &&
              React.isValidElement(Icon) &&
              React.cloneElement(Icon as React.ReactElement, {
                className: cn(Icon.props.className || 'h-[16px] w-[16px]')
              })}
            {children}
          </div>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className="z-50 mt-1 select-none rounded-[4px] border border-slate-500 bg-background px-[15px] py-[10px] text-[12px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] "
            sideOffset={5}
          >
            {title && <div className="inline-block font-bold">{title}</div>}{' '}
            {content && <div className="">{content}</div>}
            <TooltipPrimitive.Arrow className=" fill-slate-500" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export default CustomTooltip

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
