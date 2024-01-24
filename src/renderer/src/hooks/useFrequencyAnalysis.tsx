import * as React from 'react'
import _ from 'lodash'
import { linearRegression, linearRegressionLine, rSquared } from 'simple-statistics'

import { GrafContext } from '../context/GraftContext'
import { FrequencyValues, SortedByFrequency } from '@shared/models/graf'

// TODO: Fix concurrence frequency values to calculate the linear regression (throw error when the files have different frequency range)
const useFrequencyAnalysis = () => {
  const {
    graftState: { files, concInputValues }
  } = React.useContext(GrafContext)

  const calculateLinearRegression = (points: number[][]): { m: number; b: number; r: number } => {
    const reg = linearRegression(points)
    const lineEq = linearRegressionLine(reg)
    const rS = rSquared(points, lineEq)

    return {
      m: reg.m,
      b: reg.b,
      r: rS
    }
  }

  const groupByFrequency = (): SortedByFrequency => {
    if (concInputValues.length < 3)
      throw new Error('Not enough values of concentration to calculate the linear regression')

    const sortedBayFrequency = concInputValues.reduce((acc, curr) => {
      const file = files.find((f) => f.id === curr.id)
      file?.content.forEach((c) => {
        acc[c[1]] = acc[c[1]] || []
        acc[c[1]].push({
          value: curr.value,
          module: parseFloat(c[2]),
          phase: parseFloat(c[3]),
          zi: -parseFloat(c[2]) * Math.sin((parseFloat(c[3]) * Math.PI) / 180),
          zr: parseFloat(c[2]) * Math.cos((parseFloat(c[3]) * Math.PI) / 180)
        })
      }, {})
      return acc
    }, {} as SortedByFrequency)
    return sortedBayFrequency
  }

  const calculateLinearRegressionByConc = (): FrequencyValues[] => {
    const gropedValues = groupByFrequency()

    const frequencyValues: FrequencyValues[] = Object.entries(gropedValues).map(
      ([key, val], i) => ({
        [i]: {
          frequency: Math.log10(parseFloat(key)),
          module: calculateLinearRegression(val.map((v) => [v.value, v.module])),
          phase: calculateLinearRegression(val.map((v) => [v.value, v.phase])),
          zi: calculateLinearRegression(val.map((v) => [v.value, v.zi])),
          zr: calculateLinearRegression(val.map((v) => [v.value, v.zr]))
        }
      })
    )

    return frequencyValues
  }

  return {
    calculateLinearRegression,
    groupByFrequency,
    calculateLinearRegressionByConc
  }
}

export default useFrequencyAnalysis
