import React from 'react'
import { Loader } from 'lucide-react'

import AppBar from '@/components/app-bar'
import DragDrop from '@/components/drag-drop/drag-drop'
import Drawer from '@/components/drawer'
import PlotlyChart from '@/components/plot/plot'

import { GrafContext } from '../context/GraftContext'
import { LoadingsContext } from '../context/Loading'
import { useData } from '../hooks/useData'
import usePlotlyOptions from '../hooks/usePlotlyOptions'
import { IProcessFile } from '@shared/models/files'
import { PlotParams } from 'react-plotly.js'
import { IPlatform } from '@shared/models/graf'

const Graf = () => {
  const { updateData } = useData()
  const { graftState } = React.useContext(GrafContext)
  const {
    loading: { loading },
    setLoading
  } = React.useContext(LoadingsContext)
  const [platform, setPlatform] = React.useState<IPlatform>(null)
  const { data, layout, config } = usePlotlyOptions()

  // const readFiles = React.useCallback(async () => {
  //   setLoading(true)

  //   updateData(await readFilesUsingTauriProcess().finally(() => setLoading(false)))
  // }, [])

  const handleFileDropChange = React.useCallback(async () => {}, [loading])

  React.useEffect(() => {
    handleFileDropChange()

    setPlatform('desktop')
    setLoading(false)
  }, [])

  return (
    <div>
      <AppBar />
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
