import React from 'react'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'

import { cn } from '@/utils'
import { ToastProvider } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'
import { Menu } from '@/components/menu/menu'
import { ThemeProvider } from '@/components/theme-provider'

import { LoadingProvider } from './context/Loading'
import Graf from '@/components/graf'
import { GrafContext } from './context/GraftContext'
import { readFilesUnsortedFileType } from './utils/connectors'

const App = () => {
  const { setFiles, setGraftState, setUpdateContent, setProgressEvent } =
    React.useContext(GrafContext)

  React.useEffect(() => {
    window.context
      .onLoadFileInfo()
      .then((x) => {
        if (x !== undefined && x !== '.' && x !== '..' && x !== '') {
          return window.context
            .importFilesFromLoader()
            .then((files) => {
              if (files === undefined)
                return enqueueSnackbar('Something went wrong read the on load the app', {
                  variant: 'error'
                })
              const processedFiles = readFilesUnsortedFileType(
                files?.filter((f) => f !== undefined)
              )
              if (Array.isArray(processedFiles)) {
                return setFiles(processedFiles)
              } else if (typeof processedFiles === 'object') {
                return setGraftState(processedFiles)
              } else {
                return enqueueSnackbar('Something went wrong read the files on load the app', {
                  variant: 'error'
                })
              }
            })
            .catch((e) =>
              enqueueSnackbar(`Something went wrong read the file ${e}`, {
                variant: 'error'
              })
            )
        }
        return
      })
      .catch(console.error)

    window.context
      .checkUpdates()
      .then((updateInfo) => {
        if (updateInfo?.version) {
          setUpdateContent(updateInfo)
          enqueueSnackbar(`New version available version ${updateInfo.version}`, {
            variant: 'info'
          })
        }
      })
      .catch(console.error)
    window.context.on('update-available', (_, arg) => {
      setUpdateContent(arg)
    })

    window.context.on('update-downloaded', (_, arg) => {
      setProgressEvent({
        type: 'success',
        name: `Update downloaded version ${arg.version}`,
        message:
          'Update downloaded and ready to install please restart the app to apply the update',
        timeOut: 10000
      })
    })

    window.context.on('download-progress', (_, arg) => {
      setProgressEvent({
        type: 'progress',
        name: 'Downloading update',
        message: `Downloading update ${Math.round(arg.percent)}%`,
        timeOut: undefined
      })
    })
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider>
        <LoadingProvider initialState={false}>
          <SnackbarProvider
            maxSnack={4}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            autoHideDuration={8000}
            preventDuplicate
          >
            <Toaster />
            <div className="h-screen overflow-clip">
              <Menu />
              <div
                className={cn(
                  'z-0 overflow-auto border-t bg-background pb-8',
                  'scrollbar-none',
                  ' max-h-[calc(100vh-0.1rem)] min-h-[calc(100vh-0.1rem)] min-w-[calc(100vw-0.1rem)] max-w-[calc(100vw-0.1rem)]',
                  'scrollbar scrollbar-track-transparent',
                  'scrollbar-thumb-accent scrollbar-thumb-rounded-md'
                )}
              >
                <Graf />
              </div>
            </div>
          </SnackbarProvider>
        </LoadingProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
export default App
