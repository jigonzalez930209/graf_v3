import * as React from 'react'
import { GrafContext } from '@/context/GraftContext'

import { cn } from '@/utils'

import PlotItem from './plot-item'

type PlotContainerProps = {
  className?: string
}

const PlotContainer = ({ className }: PlotContainerProps) => {
  const [grafDataBayPlots, setGrafDataBayPlots] = React.useState<{
    module: [number, number, number][]
    phase: [number, number, number][]
    zi: [number, number, number][]
    zr: [number, number, number][]
  }>()

  const {
    graftState: { uniqueFrequencyCalc }
  } = React.useContext(GrafContext)

  React.useEffect(() => {
    if (uniqueFrequencyCalc) {
      const module = []
      const phase = []
      const zi = []
      const zr = []
      uniqueFrequencyCalc.forEach((g, i) => {
        module.push([Number(g[i].frequency), g[i].module.m, g[i].module.r] as never)
        phase.push([Number(g[i].frequency), g[i].phase.m, g[i].module.r] as never)
        zi.push([Number(g[i].frequency), g[i].zi.m, g[i].module.r] as never)
        zr.push([Number(g[i].frequency), g[i].zr.m, g[i].module.r] as never)
      })
      setGrafDataBayPlots({ module, phase, zi, zr })
    }
  }, [uniqueFrequencyCalc[0]])

  return (
    <div className={cn(className, 'h-full w-[100%] overflow-auto overflow-x-hidden')}>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <PlotItem title="Module" dataToGraf={grafDataBayPlots?.module} />
        <PlotItem title="Phase" dataToGraf={grafDataBayPlots?.phase} />
        <PlotItem title="ZI" dataToGraf={grafDataBayPlots?.zi} />
        <PlotItem title="ZR" dataToGraf={grafDataBayPlots?.zr} />
      </div>
    </div>
  )
}

export default PlotContainer
