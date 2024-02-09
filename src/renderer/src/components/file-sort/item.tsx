import * as React from 'react'
import { GrafContext } from '@/context/GraftContext'
import { IProcessFile } from '@shared/models/files'
import { useTheme } from 'next-themes'

import { cn } from '@/utils'

import { Checkbox } from '../ui/checkbox'
import {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger
} from '../ui/hover-card'

type ItemProps = React.PropsWithChildren & {
  className?: string
  file: IProcessFile
  setFile: (id: string) => void
}

// TODO: Eliminate files and pass as reference to avoid files.find() function
const Item = React.forwardRef<HTMLLIElement, ItemProps>((props, ref) => {
  const { className, children, file, setFile, ...rest } = props
  const { theme } = useTheme()
  const {
    graftState: { files }
  } = React.useContext(GrafContext)

  const color = theme === 'dark' ? 'white' : 'black'

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger>
        <li
          ref={ref}
          key={file.id}
          className={cn(
            className,
            'flex max-w-[220px] select-none items-center space-x-2 px-2 my-1.5 hover:bg-secondary rounded-md cursor-pointer hover:right-1  hover:ring-secondary/25',
            Boolean(files.find((d) => d.id === file.id)?.selected) &&
              'bg-secondary/50 shadow-md ring-1 ring-primary/15'
          )}
          {...rest}
        >
          <Checkbox
            checked={Boolean(files.find((d) => d.id === file.id)?.selected)}
            onCheckedChange={() => setFile(file.id)}
            id={file.id}
          />
          <label
            htmlFor={file.id}
            className="ml-2 cursor-pointer w-full overflow-hidden truncate font-extrabold hover:text-ellipsis m-1"
            style={{ color: `color-mix(in srgb, ${color} 20%, ${file.color})` }}
          >
            {file.name}
          </label>
        </li>
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent
          align="start"
          sideOffset={0}
          side="right"
          sticky="always"
          className="z-50"
        >
          <div className="scale-[90%]">
            {file.type === 'teq4' && (
              <>
                {file.selected && (
                  <div className="flex w-full  items-center justify-center">
                    <div className="w-[25px] rounded-full border text-center">{file.selected}</div>
                  </div>
                )}
                <p
                  className="my-1"
                  style={{
                    color: `color-mix(in srgb, ${color} 20%, ${file.color})`
                  }}
                >
                  {' '}
                  Name: {file.name}
                </p>
                <p>Cycles: {file.voltammeter?.cicles}</p>
                <p>Samples by second: {file.voltammeter?.samplesSec} samples/s</p>
                <p>Total Time: {file.voltammeter?.totalTime} s</p>
                <p>Total Points: {file.content?.length}</p>
              </>
            )}{' '}
            {file.type === 'teq4z' && (
              <>
                <div className="font-medium">Impedance</div>
                {file.selected && (
                  <div className="flex w-full  items-center justify-center">
                    <div className="w-[25px] rounded-full border text-center">{file.selected}</div>
                  </div>
                )}
                <p
                  className=""
                  style={{
                    color: `color-mix(in srgb, ${color} 20%, ${file.color})`
                  }}
                >
                  {file.name}
                </p>
                <p>Voltage: {file.impedance?.V} V</p>
                <p>Sinusoidal Amplitude: {file.impedance?.signalAmplitude} V</p>
                <p>Initial Frequency: {file.impedance?.sFrequency} Hz</p>
                <p>End Frequency: {file.impedance?.eFrequency} Hz</p>
                <p>Total Points: {file.impedance?.totalPoints}</p>
              </>
            )}
            {file.type === 'csv' && (
              <>
                <div className="font-medium">CSV</div>
                <p className="">{file.name}</p>
                <p>Columns: {file.content?.length}</p>
                <p>Rows: {file.content?.[0]?.length}</p>
              </>
            )}
          </div>
          <HoverCardArrow className=" fill-slate-500" />
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  )
})

export default Item
