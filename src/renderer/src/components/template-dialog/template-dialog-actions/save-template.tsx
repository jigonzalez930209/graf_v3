import * as React from 'react'
import { ExcelTableSelected, Template } from '@/utils/import-dialog-interfaces'
// import { saveImportTemplate } from '@/utils/tauri'
import { SaveIcon } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'

import { Button } from '@/components/ui/button'

type SaveTemplateProps = {
  setLoading: (boolean) => void
  columns: Template['columns']
  selected: ExcelTableSelected | undefined
  isModulePhase: boolean | undefined
}

const SaveTemplate = ({ setLoading, columns, selected, isModulePhase }: SaveTemplateProps) => {
  const handleClickSaveFileTemplate = React.useCallback(async () => {
    setLoading(true)
    await window.context
      .saveTemplate(
        JSON.stringify({
          columns: columns,
          row: selected?.row === undefined ? 0 : selected.row,
          isModulePhase: isModulePhase
        })
      )
      .then((s) => {
        enqueueSnackbar(s.content, { variant: s.type })
      })
      .catch((err) => {
        enqueueSnackbar(err.toString(), { variant: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [columns])

  return (
    <>
      <Button
        onClick={handleClickSaveFileTemplate}
        className="h-6 w-6 rounded-full"
        variant="ghost"
        size="icon"
        disabled={Object.values(columns).filter((c) => c !== undefined).length < 3}
      >
        <SaveIcon className="h-4 w-4" />
      </Button>
    </>
  )
}

export default SaveTemplate
