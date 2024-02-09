import React from 'react'
import _ from 'lodash'
import { useTheme } from 'next-themes'

import { defaultTheme } from '@/utils'

import { hovertemplate } from './usePlotlyOptions'
import { PlotParams } from 'react-plotly.js'

type useFrequencyUniquePlotOptionsProps = {
  data: [number, number, number][]
  title: string
}

const useFrequencyUniquePlotOptions = ({ data, title }: useFrequencyUniquePlotOptionsProps) => {
  const [plotOptions, setPlotOptions] = React.useState({})
  const [plotData, setPlotData] = React.useState<PlotParams['data']>([])
  const [plotLayout, setPlotLayout] = React.useState({})

  const theme = useTheme()
  const t = defaultTheme(theme)

  const fontColor = t === 'dark' ? '#e6e6e6' : '#262626'

  const handleSetPlotOptions = () => {
    setPlotData([
      {
        x: data.map((d) => d[0]), // frequency
        y: data.map((d) => d[1]), // slope
        type: 'scatter',
        hovertemplate: hovertemplate(`${'Slope'}`),
        mode: 'markers',
        name: `Slope`,
        marker: {
          color: 'red',
          size: 5
        },
        yaxis: 'y2',
        legendgroup: `slope`
      },

      {
        x: data.map((d) => d[0]), // frequency
        y: data.map((d) => d[2]), // r2
        type: 'scatter',
        hovertemplate: hovertemplate(`R<sup>2</sup>`),
        mode: 'markers',
        name: `R<sup>2</sup>`,
        marker: { color: 'blue', size: 5 },
        legendgroup: `R<sup>2</sup>`
      }
    ])

    setPlotLayout({
      // autosize: true,
      // responsive: true,

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
      hovermode: 'x unified',
      title: {
        text: title,
        font: {
          size: 18
        },
        xref: 'paper',
        x: 0.005
      },
      xaxis: {
        showticklabels: true,
        zeroline: false,
        mirror: 'ticks',
        title: {
          text: 'log<sub>10</sub>(Frequency(Hz))',
          font: {
            size: 18,
            color: fontColor
          }
        },
        color: t === 'dark' ? '#e6e6e6' : '#404040',
        dividercolor: t === 'dark' ? '#fff' : '#000',
        gridcolor: t === 'dark' ? '#404040' : ' #e6e6e6'
      },
      yaxis: {
        title: {
          text: 'R<sup>2</sup>',
          x: 0,
          font: {
            size: 18,
            color: 'blue'
          },
          tickfont: { color: 'blue' }
        },
        zeroline: false,
        tickfont: { color: 'blue' },
        color: t === 'dark' ? '#e6e6e6' : '#404040',
        dividercolor: t === 'dark' ? '#fff' : '#000',
        gridcolor: t === 'dark' ? '#404040' : ' #e6e6e6'
      },
      yaxis2: {
        title: {
          text: 'Slope',
          x: 0,
          font: {
            size: 18,
            color: 'red'
          },
          tickfont: { color: 'red' }
        },
        zeroline: false,
        overlaying: 'y',
        side: 'right',
        titlefont: { color: 'red', size: 18 },
        tickfont: { color: 'red' },
        color: t === 'dark' ? '#e6e6e6' : '#404040',
        dividercolor: t === 'dark' ? '#fff' : '#000',
        gridcolor: t === 'dark' ? '#404040' : ' #e6e6e6'
      },
      plot_bgcolor: t === 'dark' ? '#000' : '#fff',
      paper_bgcolor: t === 'dark' ? '#000' : '#fff',

      font: {
        color: t === 'dark' ? '#e6e6e6' : '#404040'
      },
      modebar: {
        activecolor: t === 'dark' ? '#bfbfbf' : '#404040',
        add: '',
        bgcolor: t === 'dark' ? '#000' : '#fff',
        color: t === 'dark' ? '#bfbfbf' : '#404040',
        orientation: 'v'
      }
    })
    setPlotOptions({ scrollZoom: true, editable: true })
  }

  React.useEffect(() => {
    handleSetPlotOptions()
  }, [data?.length])

  return { plotOptions, plotData, plotLayout, handleSetPlotOptions }
}
export default useFrequencyUniquePlotOptions
