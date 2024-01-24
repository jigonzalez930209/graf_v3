import * as React from 'react'
import { GrafContext } from '@/context/GraftContext'
import useFrequencyAnalysis from '@/hooks/useFrequencyAnalysis'
import { ConcInputValue } from '@shared/models/graf'
import { XIcon } from 'lucide-react'
import { useSnackbar } from 'notistack'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'

const ParameterInput = () => {
  const {
    graftState: { files, concInputValues },
    setSelectFilesToCalcUniqueFrequency,
    setCalcToUniqueFrequency
  } = React.useContext(GrafContext)

  const { calculateLinearRegressionByConc } = useFrequencyAnalysis()

  const { enqueueSnackbar } = useSnackbar()

  const handleCalculateFrequency = () => {
    try {
      setCalcToUniqueFrequency(calculateLinearRegressionByConc())
    } catch (error) {
      enqueueSnackbar({
        variant: 'error',
        message: Object(error).message
      })
    }
  }

  const handleSetConcValues = ({ id, value, name }) => {
    let inputValues = [...concInputValues]
    if (!inputValues.find((c) => c.id === id)) {
      inputValues = [...inputValues, { id, name, value }]
    } else {
      inputValues = inputValues.map((c) => (c.id === id ? { ...c, value } : c))
    }
    setSelectFilesToCalcUniqueFrequency(inputValues)
  }

  const handleRemoveConcValues = (id: ConcInputValue['id']) => {
    const inputValues = concInputValues.filter((c) => c.id !== id)
    setSelectFilesToCalcUniqueFrequency(inputValues)
  }

  return (
    <ul className="mb-5 grid grid-cols-3 gap-4">
      {concInputValues.map((inputValue) => (
        <li className="grid grid-cols-3 items-center justify-center" key={inputValue.id}>
          <p className="col-span-2 truncate">
            <Button
              size="icon"
              variant="ghost"
              className="ml-2 mr-1 h-4 w-4 rounded-full"
              onClick={() => handleRemoveConcValues(inputValue.id)}
            >
              <XIcon className="h-3 w-3 text-red-500" />
            </Button>
            {inputValue.name}
          </p>
          <Input
            className="col-span-1"
            type="number"
            value={inputValue.value}
            onChange={(e) => {
              const value = parseFloat(e.target.value)
              handleSetConcValues({ ...inputValue, value })
            }}
          />
        </li>
      ))}
      <li className="grid w-full grid-cols-4 items-center justify-center gap-4">
        <div className="col-span-3">
          <Select
            onValueChange={(i) =>
              handleSetConcValues({
                id: i,
                name: files.find((f) => f.id === i)?.name,
                value: 0.1
              })
            }
            defaultValue={undefined}
            value={undefined}
          >
            <SelectTrigger>
              <p className=" w-full text-xs">Select a file to add to the analysis</p>
            </SelectTrigger>
            {/* TODO: make a not files to select  */}
            <SelectContent>
              {files
                .filter(
                  (f) =>
                    f.type === 'teq4z' && concInputValues.find((c) => c.id === f.id) === undefined
                )
                .map((file) => (
                  <SelectItem value={file.id} key={file.id}>
                    {file.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full justify-center">
          <Button
            className="w-28 self-center bg-green-500 hover:bg-green-600"
            variant="secondary"
            onClick={handleCalculateFrequency}
          >
            Calculate
          </Button>
        </div>
      </li>
    </ul>
  )
}

export default ParameterInput
