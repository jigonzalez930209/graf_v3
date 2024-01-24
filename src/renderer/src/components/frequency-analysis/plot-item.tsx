import * as React from 'react'
import useFrequencyUniquePlotOptions from '@/hooks/useFrequencyUniquePlotOptions'

import Plot from '../plot/new-plot'

const PlotItem = ({ title, dataToGraf }) => {
  const { plotData, plotLayout, plotOptions, handleSetPlotOptions } = useFrequencyUniquePlotOptions(
    {
      data: dataToGraf ? dataToGraf : [],
      title: title
    }
  )

  React.useEffect(() => {
    if (dataToGraf?.length > 0) handleSetPlotOptions()
  }, [dataToGraf])

  return (
    <div className="flex scale-[95%] ring-1 shadow-md ring-primary/25 items-center justify-center">
      <Plot
        data={plotData}
        config={plotOptions}
        layout={plotLayout}
        exportFileName={title}
        isNecessaryRefreshZoom
      />
    </div>
  )
}

export default PlotItem
