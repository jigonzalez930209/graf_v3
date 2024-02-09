import React from 'react'
import { ChevronLeft, ChevronRight, GroupIcon, UngroupIcon } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'

import { readFilesUnsortedFileType } from '@renderer/utils/connectors'
import { GrafContext } from '@/context/GraftContext'
import { GroupedFiles } from '@shared/models/files'
import { cn } from '@/utils'

import FileSort from '../file-sort'
import { Button } from '../ui/button'
import RemoveSelection from './remove-selection'
import GroupFiles from './group-files'

const Drawer = () => {
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

  const handleDropFiles = React.useCallback((e: string[]) => {
    window.context
      .readFilesFromPath(e)
      .then((files) => {
        const processedFiles = readFilesUnsortedFileType(files.filter((f) => f !== undefined))
        if (Array.isArray(processedFiles)) {
          return setFiles(processedFiles)
        } else if (typeof processedFiles === 'object') {
          return setGraftState(processedFiles)
        } else {
          return enqueueSnackbar('Something went wrong read the files doped into the app', {
            variant: 'error'
          })
        }
      })
      .catch(console.error)
  }, [])

  return (
    <div className="h-[calc(100vh-3rem)] transition-all duration-300 ease-in-out border-r-2">
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
          onDrop={(e) => {
            const {
              dataTransfer: { files }
            } = e
            const filesPath = (Array.from(files) as (File & { path: string })[]).map((f) => f.path)
            preventDefaultHandler(e)
            handleDropFiles(filesPath)
            setShouldHighlight(false)
          }}
        >
          <div className="max-w-[240px] h-[calc(100vh-4.5rem)] animate-fadeIn transition-all duration-250 ease-in-out">
            <FileSort groupedFiles={groupedFiles} maxHeight="h-[calc(100vh-6.2rem)]" />
          </div>
        </div>
      )}
    </div>
  )
}

export default Drawer
