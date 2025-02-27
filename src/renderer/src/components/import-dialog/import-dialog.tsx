import * as React from 'react'
import useImportData from '@/hooks/useImportData'
import { handleImport } from '@/utils/dialog-table-utils'
import { TemplateList, TemplateListItem } from '@/utils/import-dialog-interfaces'
import { LucideImport } from 'lucide-react'
import { useSnackbar } from 'notistack'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { Button } from '../ui/button'
import CustomTooltip from '../ui/tooltip'
import FileContent from './import-dialog-actions/file-content'
import ImportFiles, { importedFile } from './import-dialog-actions/import-files'
import ImportTemplate from './import-dialog-actions/import-template'
import useLoader from '@renderer/hooks/useLoader'

const ImportDialog = () => {
  const { stopLoading, startLoading } = useLoader()
  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateListItem>()
  const [selectedFile, setSelectedFile] = React.useState<importedFile>()
  const [importedFiles, setImportedFiles] = React.useState<importedFile[]>([])
  const [templates, setTemplates] = React.useState<TemplateList>([])
  const [open, setOpen] = React.useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()

  const { importDataTeq4Z } = useImportData()

  const handleImportFiles = () => {
    const allGood = importedFiles?.map((f) => {
      if (selectedTemplate) {
        return handleImport({
          columns: selectedTemplate.template.columns,
          startLoading,
          stopLoading,
          enqueueSnackbar,
          data: f.content,
          importDataTeq4Z,
          params: {
            eFrequency: 0,
            name: f.name,
            sFrequency: 0,
            signalAmplitude: 0,
            totalPoints: f.content.length,
            V: 0
          },
          selected: { col: 0, row: selectedTemplate?.template?.row || 0 }
        })
      }
      return undefined
    })
    if (allGood?.includes(undefined)) {
      enqueueSnackbar('Something went wrong review the file list imported', { variant: 'warning' })
    } else {
      setSelectedFile(undefined)
      setTemplates([])
      setImportedFiles([])
      setSelectedTemplate(undefined)
    }
    stopLoading()
  }
  return (
    <Dialog open={open}>
      <DialogTrigger onClick={() => setOpen((prev) => !prev)}>
        <CustomTooltip title="Import files" Icon={<LucideImport className="h-5 w-5" />} />
      </DialogTrigger>
      <DialogContent className="flex h-[60%] p-6 max-w-[75%] flex-col gap-0 overflow-y-auto overflow-x-hidden">
        <DialogTitle className="sticky top-0 p-1 flex gap-10" showCloseButton={false}>
          <h2>Import Dialog</h2>
        </DialogTitle>
        <div className="mt-4 grid h-full grid-cols-4">
          <ImportTemplate
            setSelectedTemplate={setSelectedTemplate}
            selectedTemplate={selectedTemplate}
            templates={templates}
            setTemplates={setTemplates}
          />
          <ImportFiles
            setSelectedFile={setSelectedFile}
            selectedFile={selectedFile}
            setImportedFiles={setImportedFiles}
            importedFiles={importedFiles}
            disabled={templates?.length < 1}
          />
          <div className="col-span-2 flex flex-col">
            <div className="w-full rounded-md px-3 font-bold">
              File Content: {selectedFile?.name}
            </div>
            <div>
              <FileContent data={selectedFile?.content} template={selectedTemplate} />{' '}
            </div>
          </div>
        </div>
        <DialogFooter className="relative bottom-0 right-0 mt-auto flex justify-end">
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            disabled={selectedTemplate === null || importedFiles.length === 0}
            variant="default"
            className=""
            onClick={handleImportFiles}
          >
            Import Files
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ImportDialog
