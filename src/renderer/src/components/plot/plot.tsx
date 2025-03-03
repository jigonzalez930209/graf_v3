import * as React from 'react'
import { IProcessFile } from '@shared/models/files'
import { useTheme } from 'next-themes'
import Plotly, { PlotParams } from 'react-plotly.js'

import { defaultTheme } from '@/utils'
import { useScreen } from 'usehooks-ts'

type PlotlyChartProps = {
  exportFileName: string | undefined
  fileType: IProcessFile['type'] | null
  data: PlotParams['data']
  layout: PlotParams['layout']
  config: PlotParams['config']
  width: number
}

const PlotlyChart = ({
  exportFileName,
  fileType,
  data,
  layout,
  config,
  width
}: PlotlyChartProps) => {
  const theme = useTheme()
  const t = defaultTheme(theme)
  const [zoomState, setZoomState] = React.useState<{
    xRange: number[]
    yRange: number[]
    y1Range?: number[]
  } | null>(null)

  React.useEffect(() => {
    setZoomState(null)
  }, [fileType])

  // const a = useScreen()
  // console.log(a)
  const [windowSize, setWindowSize] = React.useState({ width: 0, height: 0 })

  React.useEffect(() => {
    const obtainWindowSize = async () => {
      const size = await window.context.getWindowSize()
      if (size) {
        setWindowSize(size)
      }
    }

    obtainWindowSize()

    window.addEventListener('resize', obtainWindowSize)
    return () => {
      window.removeEventListener('resize', obtainWindowSize)
    }
  }, [width])

  return (
    <Plotly
      className="w-full h-full"
      data={data}
      layout={{
        ...layout,
        width: (windowSize.width * width) / 100,
        height: windowSize.height - 48,
        autosize: true,
        plot_bgcolor: t === 'dark' ? '#000' : '#fff',
        paper_bgcolor: t === 'dark' ? '#000' : '#fff',

        font: {
          color: t === 'dark' ? '#e6e6e6' : '#404040'
        },
        modebar: {
          activecolor: t === 'dark' ? '#bfbfbf' : '#404040',
          // add: 'drawcircle',
          bgcolor: t === 'dark' ? '#000' : '#fff',
          color: t === 'dark' ? '#bfbfbf' : '#404040',
          orientation: 'v'
        },
        legend: {
          x: 0.8,
          y: 1,
          traceorder: 'normal',
          bgcolor: t === 'dark' ? '#cccccc' : '#4d4d4d',
          bordercolor: t === 'dark' ? '#404040' : '#e6e6e6',
          borderwidth: 1,
          font: {
            family: 'sans-serif',
            size: 12,
            color: t === 'dark' ? '#404040' : '#e6e6e6'
          }
        },
        xaxis: {
          ...layout?.xaxis,
          range: zoomState?.xRange,
          color: t === 'dark' ? '#e6e6e6' : '#404040',
          dividercolor: t === 'dark' ? '#fff' : '#000',
          gridcolor: t === 'dark' ? '#404040' : ' #e6e6e6'
        },
        yaxis: {
          ...layout?.yaxis,
          range: zoomState?.yRange,
          color: t === 'dark' ? '#e6e6e6' : '#404040',
          dividercolor: t === 'dark' ? '#fff' : '#000',
          gridcolor: t === 'dark' ? '#404040' : ' #e6e6e6'
        },
        ...(layout?.yaxis2 && {
          yaxis2: {
            ...layout?.yaxis2,
            range: zoomState?.y1Range,
            color: t === 'dark' ? '#e6e6e6' : '#404040',
            dividercolor: t === 'dark' ? '#fff' : '#000',
            gridcolor: t === 'dark' ? '#404040' : ' #e6e6e6'
          }
        })
      }}
      config={{
        ...config,
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: exportFileName || 'graft',
          height: 750,
          width: 1050,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        }
      }}
      onRelayout={(e) => {
        if (typeof e['xaxis.range[0]'] === 'number') {
          setZoomState({
            xRange: [e['xaxis.range[0]'], e['xaxis.range[1]']],
            yRange: [e['yaxis.range[0]'], e['yaxis.range[1]']],
            ...(e['yaxis2.range[0]'] && {
              y1Range: [e['yaxis2.range[0]'], e['yaxis2.range[1]']]
            })
          })
        } else {
          setZoomState(null)
        }
      }}
      useResizeHandler
    />
  )
}

export default PlotlyChart
