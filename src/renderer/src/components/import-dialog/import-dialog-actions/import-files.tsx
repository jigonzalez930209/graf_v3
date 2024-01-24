import * as React from 'react'
import { arrayBufferToString, homogenizeMatrix } from '@/utils/common'
import { PlusIcon } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'
import XLSX from 'xlsx'

import { Button } from '@/components/ui/button'

import FileListSelector from './file-list-selector'
import { supportedFileTypeObject } from '@shared/constants'

export type importedFile = {
  name: string
  content: string[][]
}

type ImportFilesProps = {
  setSelectedFile: React.Dispatch<React.SetStateAction<importedFile | undefined>>
  selectedFile: importedFile | undefined
  setImportedFiles: React.Dispatch<React.SetStateAction<importedFile[] | []>>
  importedFiles: {
    name: string
    content: string[][]
  }[]
  disabled: boolean
}
const ImportFiles = ({
  setSelectedFile,
  selectedFile,
  setImportedFiles,
  importedFiles,
  disabled
}: ImportFilesProps) => {
  const handleImportClick = React.useCallback(async () => {
    await window.context.getBinaryFiles().then(async (files) => {
      if (files === undefined || files.length === 0) {
        enqueueSnackbar('No file selected or file not supported', { variant: 'error' })
        return undefined
      }
      const processFiles = files.map(async (file) => {
        if (file.type === supportedFileTypeObject.csv) {
          const binaryString = await arrayBufferToString(file.content, 'UFT-8')
          const workbook = XLSX.read(binaryString, {
            type: 'binary'
          })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          return homogenizeMatrix(data, '')
        } else if (file.type === supportedFileTypeObject.txt) {
          const binaryString = await arrayBufferToString(file.content, 'UFT-8')
          const workbook = XLSX.read(
            binaryString
              // eliminate all \r\n and replace all spaces with tabs
              .replace(/\r\n/g, '\n')
              // Eliminate all spaces before a any letter except number and replace with ''
              .replace(/ (\D)/g, '$1')
              // Eliminate all \t\r\f\v;:"' and replace with \t
              .replace(/[ \t\r\f\v;:"']+/g, '\t'),
            {
              type: 'binary',
              FS: '\t'
            }
          )
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          return homogenizeMatrix(data, '')
        } else if (
          file.type === supportedFileTypeObject.xls ||
          file.type === supportedFileTypeObject.xlsx
        ) {
          const workbook = XLSX.read(file.content, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          return homogenizeMatrix(data, '')
        } else {
          return undefined
        }
      })
      const processedFiles = await Promise.all(processFiles)
      const filteredProcessedFiles = processedFiles.filter((f) => f !== undefined)
      const filesWithNames = filteredProcessedFiles.map((f, i) => ({
        name: files[i].name,
        content: f
      }))
      setImportedFiles(filesWithNames)
    })
  }, [])

  return (
    <div>
      <FileListSelector
        items={importedFiles}
        selectedItem={selectedFile}
        setSelectedItem={setSelectedFile}
        title="Files Selected"
      />
      <Button onClick={handleImportClick} disabled={disabled} className="w-3/4">
        <PlusIcon className="h-5 w-5" />
        <span>Select Files</span>
      </Button>
    </div>
  )
}

export default ImportFiles
