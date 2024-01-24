/* eslint-disable */
/* @ts-ignore:file */

import * as React from 'react'
import _ from 'lodash'
import { useTheme } from 'next-themes'
import { useWindowSize } from 'usehooks-ts'
import { PlotParams } from 'react-plotly.js'

import { defaultTheme, COLORS } from '@/utils'

import { GrafContext } from '../context/GraftContext'
import { useData } from './useData'

type CsvValues =
  | {
      x: string[] | number[]
      y: string[] | number[]
      type: 'scatter'
      hovertemplate: string
      mode: string
      name: string
      legendgroup: string
      marker: {
        color: string
        size: number
      }
      line: {
        color: string
        width: number
      }
      color: string
    }[]
  | []

const StaticValues = ({
  drawerOpen = true,
  width = 720,
  height = 540
}): Partial<PlotParams['layout']> => ({
  autosize: true,
  width: drawerOpen ? width - 270 : width * 0.98,
  height: drawerOpen ? height - 53 : height - 53,
  legend: {
    x: -5,
    y: 1,
    traceorder: 'normal',
    font: {
      family: 'sans-serif',
      size: 12,
      color: '#000'
    }
  },
  margin: {
    l: 50,
    r: 50,
    b: 100,
    t: 50,
    pad: 4
  },
  title: {
    font: {
      size: 18
    },
    xref: 'paper',
    x: 0.005
  }
})

export const hovertemplate = (name: string) => `
  <b>${name}</b><br>
  <br>
  %{yaxis.title.text}: %{y}<br>
  %{xaxis.title.text}: %{x}<br>
  <extra></extra>
`

const usePlotlyOptions = () => {
  const {
    graftState: {
      fileType,
      graftType,
      impedanceType,
      stepBetweenPoints,
      drawerOpen,
      csvFileColum,
      lineOrPointWidth
    }
  } = React.useContext(GrafContext)
  const { height, width } = useWindowSize()

  const theme = useTheme()
  const t = defaultTheme(theme)

  const {
    getImpedanceData,
    getModuleFace,
    getVCData,
    getZIZRvsFrequency,
    getCSVData,
    data: currentData
  } = useData()

  const [layout, setLayout] = React.useState<PlotParams['layout'] | null>(null)
  const [config, setConfig] = React.useState({
    scrollZoom: true,
    editable: true
  })
  const [data, setData] = React.useState<PlotParams['data']>([])

  const fontColor = t === 'dark' ? '#e6e6e6' : '#262626'

  React.useEffect(() => {
    if (currentData?.length > 0) {
      if (fileType === 'teq4z') {
        if (impedanceType === 'Bode') {
          setData(
            _.flatMapDepth(
              getModuleFace()?.map((d) => [
                {
                  x: d.content.map((i) => i.face.x),
                  y: d.content.map((i) => i.face.y),
                  type: 'scatter',
                  hovertemplate: hovertemplate(`phase_${d.name}`),
                  mode: graftType === 'line' ? 'lines+markers' : 'markers',
                  name: `phase_${d.name}`,
                  marker: {
                    color: d.color,
                    size: graftType === 'line' ? lineOrPointWidth + 3 : lineOrPointWidth
                  },
                  line: { color: d.color, width: lineOrPointWidth },
                  yaxis: 'y2',
                  legendgroup: `${d.name}`
                },
                {
                  x: d.content.map((i) => i.module.x),
                  y: d.content.map((i) => i.module.y),
                  type: 'scatter',
                  hovertemplate: hovertemplate(`module_${d.name}`),
                  mode: graftType === 'line' ? 'lines+markers' : 'markers',
                  name: `module_${d.name}`,
                  marker: {
                    color: d.color,
                    size: graftType === 'line' ? lineOrPointWidth + 3 : lineOrPointWidth
                  },

                  line: { color: d.color, width: lineOrPointWidth },
                  legendgroup: `${d.name}`
                }
              ])
            )
          )

          setLayout({
            ...StaticValues({
              drawerOpen: drawerOpen,
              width: width,
              height: height
            }),
            hovermode: 'closest',
            title: {
              text: impedanceType,
              font: {
                size: 18,
                color: fontColor
              },
              xref: 'paper',
              x: 0.005
            },
            xaxis: {
              title: {
                text: 'log10(Frequency(Hz))',
                font: {
                  size: 18,
                  color: fontColor
                }
              }
            },
            yaxis: {
              title: {
                text: 'Module',
                // x: 0,
                font: {
                  size: 18,
                  color: fontColor
                }
              }
            },
            yaxis2: {
              title: 'Phase',
              overlaying: 'y',
              side: 'right',
              titlefont: { color: fontColor, size: 18 },
              tickfont: { color: fontColor }
            }
          })
        } else if (impedanceType === 'Nyquist') {
          setData(
            getImpedanceData().map((d) => ({
              x: d.content.map((i) => i[0]),
              y: d.content.map((i) => i[1]),
              hovertemplate: hovertemplate(d.name),
              type: 'scatter',
              mode: graftType === 'line' ? 'lines+markers' : 'markers',
              name: d.name,
              marker: {
                color: d.color,
                size: graftType === 'line' ? lineOrPointWidth + 3 : lineOrPointWidth
              },
              line: { color: d.color, width: lineOrPointWidth }
            }))
          )
          setLayout({
            hovermode: 'closest',
            ...StaticValues({
              drawerOpen: drawerOpen,
              width: width,
              height: height
            }),
            title: {
              text: impedanceType,
              font: {
                size: 18,
                color: fontColor
              },
              xref: 'paper',
              x: 0.05
            },
            xaxis: {
              title: {
                text: 'ZR',
                font: {
                  // family: 'Courier New, monospace',
                  size: 18,
                  color: fontColor
                }
              }
            },
            yaxis: {
              title: {
                text: 'ZI',
                font: {
                  // family: 'Courier New, monospace',
                  size: 18,
                  color: fontColor
                }
              }
            }
          })
        } else if (impedanceType === 'ZiZrVsFreq') {
          setData(
            _.flatMapDepth(
              getZIZRvsFrequency().map((d) => [
                {
                  x: d.content.map((j) => j.Zi.x),
                  y: d.content.map((j) => j.Zi.y),
                  type: 'scatter',
                  hovertemplate: hovertemplate(`ZI_${d.name}`),
                  mode: graftType === 'line' ? 'lines+markers' : 'markers',
                  name: `ZI_${d.name}`,
                  marker: {
                    color: d.color,
                    size: graftType === 'line' ? lineOrPointWidth + 3 : lineOrPointWidth
                  },
                  line: { color: d.color, width: lineOrPointWidth },
                  yaxis: 'y2',
                  legendgroup: `${d.name}`
                },
                {
                  x: d.content.map((j) => j.Zr.x),
                  y: d.content.map((j) => j.Zr.y),
                  type: 'scatter',
                  hovertemplate: hovertemplate(`ZR_${d.name}`),
                  mode: graftType === 'line' ? 'lines+markers' : 'markers',
                  name: `ZR_${d.name}`,
                  marker: { color: d.color, size: lineOrPointWidth },
                  line: { color: d.color, width: lineOrPointWidth },
                  legendgroup: `${d.name}`
                }
              ])
            )
          )

          setLayout({
            ...StaticValues({
              drawerOpen: drawerOpen,
              width: width,
              height: height
            }),
            hovermode: 'closest',
            title: {
              text: impedanceType,
              font: {
                size: 18
              },
              xref: 'paper',
              x: 0.005
            },
            xaxis: {
              title: {
                text: 'log10(Frequency(Hz))',
                font: {
                  size: 18,
                  color: fontColor
                }
              }
            },
            yaxis: {
              title: {
                text: 'ZR',
                // x: 0,
                font: {
                  size: 18,
                  color: fontColor
                }
              }
            },
            yaxis2: {
              title: 'ZI',
              overlaying: 'y',
              side: 'right',
              titlefont: { color: fontColor, size: 18 },
              tickfont: { color: fontColor }
            }
          })
        }
      } else if (fileType === 'teq4') {
        setData(
          getVCData(stepBetweenPoints).map((d) => ({
            x: d.content.map((j) => j[0]),
            y: d.content.map((j) => j[1]),
            type: 'scatter',
            hovertemplate: hovertemplate(d.name),
            mode: graftType === 'line' ? 'lines' : 'markers',
            name: d.name,
            marker: {
              color: d.color,
              size: graftType === 'line' ? 0 : lineOrPointWidth
            },
            line: { color: d.color, width: lineOrPointWidth },
            color: d.color
          }))
        )

        setLayout({
          ...StaticValues({
            drawerOpen: drawerOpen,
            width: width,
            height: height
          }),
          title: {
            text: 'VC',
            font: {
              size: 18,
              color: fontColor
            },
            xref: 'paper',
            x: 0.05
          },
          xaxis: {
            title: {
              text: 'Voltage (mV)',
              font: {
                size: 18,
                color: fontColor
              }
            }
          },
          yaxis: {
            title: {
              text: 'Current (mA)',
              font: {
                size: 18,
                color: fontColor
              }
            }
          }
        })
      } else if (fileType === 'csv') {
        const csvData = getCSVData(
          csvFileColum?.find(
            (csv) => csv.selected && !!currentData.find((d) => d.name === csv.fileName)?.name
          )
        )

        if (csvData?.x?.length === 1) {
          /* @ts-ignore */
          setData(
            _.flatMapDepth(
              !!csvData &&
                csvData?.y?.map((d, i) => {
                  const values = []
                  values.push({
                    x: csvData.x?.[0]?.content,
                    y: d?.content,
                    type: 'scatter',
                    hovertemplate: hovertemplate(csvData?.y?.[i].name || ''),
                    mode: graftType === 'line' ? 'lines' : 'markers',
                    name: d.name,
                    legendgroup: `${d?.name}`,
                    marker: {
                      color: COLORS[i],
                      size: lineOrPointWidth
                    },
                    line: {
                      color: COLORS[i],
                      width: lineOrPointWidth
                    },
                    color: COLORS[i]
                  } as never)
                  csvData?.y2?.[i]?.name &&
                    values.push({
                      x: csvData?.x?.[0]?.content,
                      y: csvData?.y2?.[i]?.content,
                      type: 'scatter',
                      hovertemplate: hovertemplate(`y2_${csvData?.y2?.[i]?.name}`),
                      mode: graftType === 'line' ? 'lines' : 'markers',
                      name: `y2_${csvData?.y2?.[i]?.name}`,
                      legendgroup: `${csvData.x?.[0]?.name}`,
                      yaxis: 'y2',
                      marker: {
                        color: COLORS[i],
                        size: lineOrPointWidth
                      },
                      line: {
                        color: COLORS[i],
                        width: lineOrPointWidth
                      },
                      color: COLORS[i]
                    } as never)

                  return values
                })
            )
          )

          setLayout({
            ...StaticValues({
              drawerOpen: drawerOpen,
              width: width - 150,
              height: height - 150
            }),
            xaxis: {
              title: {
                text: csvData.x[0].name,
                font: {
                  size: 18,
                  color: fontColor
                }
              }
            },
            yaxis: {
              title: {
                text: csvData?.y?.[0].name,
                // x: 0,
                font: {
                  size: 18,
                  color: fontColor
                }
              }
            },
            yaxis2: {
              title: csvData?.y2?.[0]?.name,
              overlaying: 'y',
              side: 'right',
              titlefont: { color: fontColor, size: 18 },
              tickfont: { color: fontColor }
            }
          })

          return
        } else if (!!csvData?.x?.length && csvData.x.length > 1) {
          setData(
            _.flatMapDepth(
              csvData.x.map((d, i) => {
                const values = []
                values.push({
                  x: d.content,
                  y: csvData.y?.[i].content,
                  type: 'scatter',
                  hovertemplate: hovertemplate('CSV'),

                  mode: graftType === 'line' ? 'lines' : 'markers',
                  name: csvData.y?.[i].name,
                  legendgroup: `${d.name}`,
                  marker: {
                    color: COLORS[i],
                    size: lineOrPointWidth
                  },
                  line: {
                    color: COLORS[i],
                    width: lineOrPointWidth
                  },
                  color: COLORS[i]
                } as never)
                csvData.y2?.[i]?.name &&
                  values.push({
                    x: d.content,
                    y: csvData.y2[i].content,
                    type: 'scatter',
                    mode: graftType === 'line' ? 'lines' : 'markers',
                    name: `y2_${csvData.y2[i].name}`,
                    legendgroup: `${d.name}`,
                    yaxis: 'y2',
                    marker: {
                      color: COLORS[i],
                      size: lineOrPointWidth
                    },
                    line: {
                      color: COLORS[i],
                      width: lineOrPointWidth
                    },
                    color: COLORS[i]
                  } as never)

                return values
              })
            )
          )

          setLayout({
            ...StaticValues({
              drawerOpen: drawerOpen,
              width: width - 150,
              height: height - 120
            }),
            hovermode: 'closest',
            xaxis: {
              title: {
                text: csvData.x[0].name,
                font: {
                  size: 18,
                  color: fontColor
                }
              }
            },
            yaxis: {
              title: {
                text: csvData.y?.[0].name,
                // x: 0,
                font: {
                  size: 18,
                  color: fontColor
                }
              }
            },
            yaxis2: {
              title: csvData?.y2?.[0]?.name,
              overlaying: 'y',
              side: 'right',
              titlefont: { color: fontColor, size: 18 },
              tickfont: { color: fontColor }
            }
          })
        } else {
          setData([])
          setLayout({})
        }
      } else {
        setLayout(StaticValues({ drawerOpen: drawerOpen, width: width, height: height }))
      }

      // set config and layout
      if (graftType === 'line') {
      } else if (graftType === 'scatter') {
      }
    }

    return () => {
      setLayout(null)
      setConfig({ scrollZoom: true, editable: true })
      setData([])
    }
  }, [
    currentData,
    fileType,
    graftType,
    impedanceType,
    width,
    height,
    stepBetweenPoints,
    drawerOpen,
    csvFileColum,
    lineOrPointWidth,
    fontColor
  ])

  return {
    layout,
    config,
    data
  }
}

export default usePlotlyOptions
