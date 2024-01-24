import React from 'react'
import { GrafContext } from '@/context/GraftContext'
import { exportExcelFrequency } from '@/utils/common'
import { FileUp } from 'lucide-react'

import { Button } from '../ui/button'
import { enqueueSnackbar } from 'notistack'

const ExportToExcel = () => {
  const {
    graftState: { uniqueFrequencyCalc, concInputValues }
  } = React.useContext(GrafContext)

  const handleExport = React.useCallback(async () => {
    const dataBlob = await exportExcelFrequency({
      uniqueFrequencyCalc,
      concInputValues
    })

    window.context
      .saveExcelFile('Frequency_Analysis_', dataBlob)
      .then((r) => {
        enqueueSnackbar(r.content, { variant: r.type })
      })
      .catch(console.error)
  }, [])

  return (
    <Button className="h-7 w-7 rounded-full" variant="ghost" size="icon" onClick={handleExport}>
      <FileUp className="h-4 w-4" />
    </Button>
  )
}

export default ExportToExcel
