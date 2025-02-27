import * as React from 'react'
import { arrayBufferToString, homogenizeMatrix } from '@/utils/common'
import { Import } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'
import XLSX from 'xlsx'

import { Button } from '@/components/ui/button'
import { supportedFileTypeObject } from '@shared/constants'
import useLoader from '@renderer/hooks/useLoader'

const ImportFile = ({ setData, setSelected, setColumns, setParams }) => {
  const { startLoading, stopLoading } = useLoader()

  const handleImportClick = async () => {
    startLoading()
    setData(null)
    setSelected(null)
    setColumns([])
    window.context
      .getBinaryFiles()
      .then(async (files) => {
        if (files === undefined) {
          return enqueueSnackbar('No file selected or file not supported', { variant: 'error' })
        }
        const file = files[0]
        if (file === undefined) {
          return enqueueSnackbar('No file selected or file not supported', { variant: 'error' })
        }

        setParams((prev) => ({ ...prev, name: file.name }))
        const fileName = file.name.toLocaleLowerCase()

        if (fileName.endsWith('.csv')) {
          const binaryString = await arrayBufferToString(file.content, 'UFT-8')
          const workbook = XLSX.read(binaryString, {
            type: 'binary'
          })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          setData(homogenizeMatrix(data, ''))

          return enqueueSnackbar('Load File successful ', { variant: 'success' })
        } else if (fileName.endsWith('.txt')) {
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

          setData(homogenizeMatrix(data, ''))

          return enqueueSnackbar('Load File successful ', { variant: 'success' })
        } else if (
          file.type === supportedFileTypeObject.xls ||
          file.type === supportedFileTypeObject.xlsx
        ) {
          const workbook = XLSX.read(file.content, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          setData(homogenizeMatrix(data, ''))

          return enqueueSnackbar('Load File successful ', { variant: 'success' })
        } else {
          return enqueueSnackbar('File not supported', { variant: 'error' })
        }
      })
      .catch((err) => {
        console.log('err', err)
        return enqueueSnackbar('File not supported', { variant: 'error' })
      })
      .finally(() => {
        stopLoading()
      })
  }

  return (
    <>
      <Button
        onClick={handleImportClick}
        className="h-6 w-6 rounded-full"
        variant="ghost"
        size="icon"
      >
        <Import className="h-4 w-4" />
      </Button>
    </>
  )
}

export default ImportFile
