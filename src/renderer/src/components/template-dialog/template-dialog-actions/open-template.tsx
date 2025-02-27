import * as React from 'react'
import { ExcelTableData, ExcelTableSelected, Template } from '@/utils/import-dialog-interfaces'
import { FolderOpenIcon } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'

import { Button } from '@/components/ui/button'
import { supportedFileTypeObject } from '@shared/constants'
import useLoader from '@renderer/hooks/useLoader'

type OpenTemplateProps = {
  setColumns: React.Dispatch<React.SetStateAction<Template['columns']>>
  setSelected: React.Dispatch<React.SetStateAction<ExcelTableSelected | undefined>>
  data: ExcelTableData | undefined
  setIsModulePhase: React.Dispatch<React.SetStateAction<boolean>>
}

const OpenTemplate = ({ setColumns, setSelected, data, setIsModulePhase }: OpenTemplateProps) => {
  const { startLoading, stopLoading } = useLoader()

  const handleOpenImportTemplate = React.useCallback(async () => {
    startLoading()
    await window.context
      .getTemplates()
      .then((templates) => {
        if (
          templates === undefined ||
          templates[0] === undefined ||
          templates[0].type !== supportedFileTypeObject.template
        ) {
          return enqueueSnackbar('No file selected or file not supported', { variant: 'error' })
        }
        const template = JSON.parse(templates[0].content) as Template
        setSelected({ row: template.row, col: template.columns.frequency.col })
        setColumns(template.columns)
        setIsModulePhase(template.isModulePhase)
        return enqueueSnackbar('Load File successful ', { variant: 'success' })
      })
      .catch((err) => {
        enqueueSnackbar(err.toString(), { variant: 'error' })
      })
      .finally(() => {
        stopLoading()
      })
  }, [])

  return (
    <Button
      onClick={handleOpenImportTemplate}
      className="h-6 w-6 rounded-full"
      variant="ghost"
      size="icon"
      disabled={!data}
    >
      <FolderOpenIcon className="h-4 w-4" />
    </Button>
  )
}

export default OpenTemplate
