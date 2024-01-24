import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'

import { readFilesUnsortedFileType } from '@renderer/utils/connectors'
import { GrafContext } from '@/context/GraftContext'
import { cn } from '@/utils'

import FileSort from '../file-sort'
import { Button } from '../ui/button'

const Drawer = () => {
  const {
    graftState: { drawerOpen },
    setDrawerOpen,
    setFiles,
    setGraftState
  } = React.useContext(GrafContext)

  const [shouldHighlight, setShouldHighlight] = React.useState(false)

  const preventDefaultHandler = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

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
    <div
      className={cn('z-0 mr-2 flex drop-shadow-lg', shouldHighlight && ' bg-gray-400 ring-2')}
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
      <div className={cn(!drawerOpen && 'hidden', 'max-w-[240px] ')}>
        <FileSort maxHeight="h-[calc(100vh-3rem)]" />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="inline-flex h-full w-[10px] cursor-pointer items-center  justify-center rounded-l  hover:bg-gradient-to-l hover:from-primary hover:via-secondary hover:to-secondary"
        asChild
        onClick={() => setDrawerOpen(!drawerOpen)}
      >
        {drawerOpen ? (
          <ChevronLeft className="h-[15px] w-[15px] text-primary" />
        ) : (
          <ChevronRight className="h-[15px] w-[15px] text-primary" />
        )}
      </Button>
    </div>
  )
}

export default Drawer
