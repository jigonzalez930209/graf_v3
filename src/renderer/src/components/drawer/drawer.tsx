import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'

import { readFilesUnsortedFileType } from '@renderer/utils/connectors'
import { GrafContext } from '@/context/GraftContext'
import { GroupedFiles } from '@shared/models/files'
import { cn, COLORS } from '@/utils'

import FileSort from '../file-sort'
import { Button } from '../ui/button'
import RemoveSelection from './remove-selection'
import GroupFiles from './group-files'
import { useDropzone } from 'react-dropzone'
import { arrayBufferToString, fileType } from '@renderer/utils/common'

const Drawer = () => {
  const onDrop = React.useCallback(async (acceptedFiles) => {
    try {
      const filePromises = acceptedFiles.map((file, index) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()

          reader.onabort = () => {
            console.log('File reading was aborted')
            reject(new Error('File reading was aborted'))
          }

          reader.onerror = () => {
            console.log('File reading has failed')
            reject(new Error('File reading has failed'))
          }

          reader.onload = async () => {
            const result = reader.result
            if (!result) {
              return reject(new Error('not found result to read file'))
            }
            try {
              const content = await arrayBufferToString(result as ArrayBuffer)
              const type = fileType(file.name)
              if (type === undefined) return resolve(null)
              resolve({
                content,
                name: file.name,
                type,
                color: COLORS[index]
              })
            } catch (error) {
              reject(error)
            }
          }

          reader.readAsArrayBuffer(file)
        })
      })

      const files = await Promise.all(filePromises)
      const validFiles = files.filter((file) => file !== null)

      const filesProcessed = readFilesUnsortedFileType(validFiles)
      if (Array.isArray(filesProcessed)) setFiles(filesProcessed)
      else if (filesProcessed === undefined) {
        enqueueSnackbar('error', { variant: 'error' })
      } else {
        setGraftState(filesProcessed)
      }
      setShouldHighlight(false)
    } catch (error) {
      console.error('Error processing files:', error)
      enqueueSnackbar('error', { variant: 'error' })
      setShouldHighlight(false)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })
  const {
    graftState: { drawerOpen, isFilesGrouped, files },
    setDrawerOpen,
    setFiles,
    setGraftState,

    setIsFilesGrouped
  } = React.useContext(GrafContext)

  const [groupedFiles, setGroupedFiles] = React.useState<GroupedFiles>({
    teq4: [],
    teq4Z: [],
    csv: [],
    all: files
  })

  const [shouldHighlight, setShouldHighlight] = React.useState(false)

  const groupFiles = React.useCallback(() => {
    if (isFilesGrouped) {
      setGroupedFiles({
        teq4: [],
        teq4Z: [],
        csv: [],
        all: files
      })
    } else {
      setGroupedFiles({
        teq4: files.filter((f) => f.type === 'teq4'),
        teq4Z: files.filter((f) => f.type === 'teq4z'),
        csv: files.filter((f) => f.type === 'csv'),
        all: []
      })
    }
  }, [groupedFiles])

  const handleChangeGroupedFiles = React.useCallback(() => {
    setIsFilesGrouped(!isFilesGrouped)
    groupFiles()
  }, [isFilesGrouped])

  const preventDefaultHandler = React.useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  return (
    <div className="h-[calc(100vh-3rem)] max-h-[calc(100vh-3rem)] w-full transition-all duration-300 ease-in-out border-r-2">
      <div
        className={cn(
          'sticky top-0 z-50 flex w-full justify-between gap-4 bg-secondary px-3 py-1 border-b-2',
          !drawerOpen && 'px-0'
        )}
      >
        {drawerOpen && (
          <>
            <GroupFiles
              isFilesGrouped={isFilesGrouped}
              handleChangeGroupedFiles={handleChangeGroupedFiles}
            />
            <RemoveSelection />
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          {drawerOpen ? (
            <ChevronLeft className="h-[15px] w-[15px] text-primary" />
          ) : (
            <ChevronRight className="h-[15px] w-[15px] text-primary" />
          )}
        </Button>
      </div>
      {drawerOpen && (
        <div
          {...getRootProps()}
          className={cn(
            'z-0 mr-2 flex drop-shadow-lg animate-fade-in transition-all duration-300 ease-in-out',
            shouldHighlight && ' bg-gray-400 ring-2'
          )}
          onDragOver={(e) => {
            preventDefaultHandler(e)
            setShouldHighlight(true)
          }}
          onDragEnter={(e) => {
            preventDefaultHandler(e)
            setShouldHighlight(true)
          }}
          onDragLeave={(e) => {
            preventDefaultHandler(e)
            setShouldHighlight(false)
          }}
          onClick={(e) => e.preventDefault()}
        >
          <input {...getInputProps()} className="hidden" />

          <div className="w-full h-[calc(100vh-4.5rem)] animate-fadeIn transition-all duration-250 ease-in-out">
            <FileSort groupedFiles={groupedFiles} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Drawer
