import React from 'react'
import { Loader } from 'lucide-react'

import DragDrop from '@/components/drag-drop/drag-drop'
import Drawer from '@/components/drawer'
import PlotlyChart from '@/components/plot/plot'

import { GrafContext } from '../context/GraftContext'
import { LoadingsContext } from '../context/Loading'
import { PlotParams } from 'react-plotly.js'

import { IProcessFile } from '@shared/models/files'

import usePlotlyOptions from '../hooks/usePlotlyOptions'

const Graf = () => {
  const { graftState } = React.useContext(GrafContext)
  const {
    loading: { loading }
  } = React.useContext(LoadingsContext)

  const { data, layout, config } = usePlotlyOptions()

  return (
    <div>
      {loading && <Loader />}
      <div className="flex max-h-full max-w-full">
        <Drawer />
        {graftState?.fileType === 'csv' ? (
          <DragDrop
            PlotlyChart={
              <PlotlyChart
                layout={layout as PlotParams['layout']}
                config={config}
                data={data}
                fileType={graftState.fileType}
                exportFileName={graftState.files.find((file) => file.selected)?.name ?? undefined}
              />
            }
          />
        ) : (
          <PlotlyChart
            layout={layout as PlotParams['layout']}
            config={config}
            data={data}
            fileType={graftState.fileType as IProcessFile['type']}
            exportFileName={graftState.files.find((file) => file.selected)?.name}
          />
        )}
      </div>
    </div>
  )
}
export default Graf
