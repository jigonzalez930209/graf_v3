import * as React from 'react'
import { GrafContext } from '@/context/GraftContext'

import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Slider } from '../ui/slider'
import ColorSelectPalette from './color-select'
import { IGrafType, IGraftImpedanceType } from '@shared/models/graf'
import { IMPEDANCE_TYPE } from '@shared/constants'

export const Settings = () => {
  const {
    graftState: { stepBetweenPoints, fileType, impedanceType, lineOrPointWidth, graftType },
    setImpedanceType,
    setLineOrPointWidth,
    setStepBetweenPoints,
    setGraftType
  } = React.useContext(GrafContext)

  return (
    <ul className="m-0 grid w-[600px] list-none gap-y-[20px]">
      <li className="grid grid-cols-5 items-center gap-3 px-[22px]">
        <Label className="col-span-2 align-top">Line type</Label>
        <Select
          onValueChange={(t) => setGraftType(t as IGrafType)}
          value={graftType}
          defaultValue="line"
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select line or scatter type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Line</SelectItem>
            <SelectItem value="scatter">Scatter</SelectItem>
          </SelectContent>
        </Select>
      </li>
      <li className="grid grid-cols-5  gap-3 px-[22px]">
        <Label className="col-span-2 align-top">Width of line or points</Label>
        <Slider
          className="col-span-3 w-full"
          onValueChange={(w) => setLineOrPointWidth(w[0])}
          defaultValue={[3]}
          value={[lineOrPointWidth]}
          max={20}
          min={1}
          step={1}
        />
      </li>
      {fileType === 'teq4' && (
        <li className="grid grid-cols-5  gap-3 px-[22px]">
          <Label className="col-span-2 align-top">Steps between points</Label>
          <Slider
            className="col-span-3 w-full"
            onValueChange={(s) => setStepBetweenPoints(s[0])}
            defaultValue={[30]}
            value={[stepBetweenPoints]}
            max={30}
            min={1}
            step={1}
          />
        </li>
      )}
      {fileType === 'teq4z' && (
        <li className="grid grid-cols-5 items-center gap-3 px-[22px]">
          <Label className="col-span-2 align-top">Impedance type</Label>
          <Select
            onValueChange={(i) => setImpedanceType(i as IGraftImpedanceType)}
            defaultValue={IMPEDANCE_TYPE[1]}
            value={impedanceType}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select an Impedance type " />
            </SelectTrigger>
            <SelectContent>
              {IMPEDANCE_TYPE.map((item) => (
                <SelectItem key={item} value={item} className="capitalize">
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </li>
      )}
      <li className="grid grid-cols-5  gap-3  px-[22px]">
        <div className="col-span-2 self-center align-middle">Palette</div>
        <div className="col-span-3">
          <ColorSelectPalette />
        </div>
      </li>
    </ul>
  )
}
