import React, { useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { UpdateIcon } from '@radix-ui/react-icons'
import { GithubIcon, HomeIcon } from 'lucide-react'

import icon from '@/assets/graph-icon.png'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { GrafContext } from '@renderer/context/GraftContext'
import { cn } from '@renderer/utils'
import { enqueueSnackbar } from 'notistack'

export function AboutDialog() {
  const {
    graftState: { updateContent },
    setUpdateContent,
    setProgressEvent
  } = React.useContext(GrafContext)

  const [updateState, setUpdateState] = useState<
    'success' | 'pending' | 'inProgress' | 'finish' | undefined
  >(undefined)

  const [updateText, setUpdateText] = useState('')

  const [appInfo, setAppInfo] = useState({
    version: '',
    name: '',
    electronVersion: '',
    arc: ''
  })

  const handleInitialState = React.useCallback(async () => {
    const { version, name, electronVersion, arc } = await window.context.getAppInfo()
    setAppInfo({ version, name, electronVersion, arc })
    if (updateContent?.version) {
      setUpdateText(`New version available version ${updateContent.version}`)
      setUpdateState('pending')
      return
    }
    setUpdateState(undefined)
    setUpdateText('Please check for updates...')
  }, [])

  const quitAndInstall = React.useCallback(async () => {
    setUpdateContent(null)
    setUpdateText('You have the latest version.')
    window.context.quitAndInstall()
  }, [])

  const checkUpdates = React.useCallback(async () => {
    window.context.checkUpdates().then((updateInfo) => {
      if (updateInfo) {
        setUpdateText(`New version available version ${updateInfo?.version}`)
        setUpdateContent(updateInfo)
        setUpdateState('success')
        return
      }
      setUpdateState(undefined)
      setUpdateText('You have the latest version.')
    })
  }, [])

  const downloadUpdate = React.useCallback(async () => {
    enqueueSnackbar('Downloading update', { variant: 'info' })
    setUpdateState('inProgress')
    setProgressEvent({
      type: 'progress',
      name: 'Downloading update',
      message: 'Please wait...',
      timeOut: undefined
    })

    window.context
      .downloadUpdate()
      .then((downloadInfo) => {
        if (!downloadInfo) return
        setUpdateState('pending')
        enqueueSnackbar('Update downloaded', { variant: 'success' })
        setProgressEvent({
          type: 'success',
          name: 'Update downloaded',
          message: 'Please install the update',
          timeOut: 9000
        })
      })
      .catch((err) => {
        enqueueSnackbar(err.toString(), { variant: 'error' })
        setUpdateState(undefined)
      })
  }, [])

  React.useEffect(() => {
    handleInitialState()
  }, [handleInitialState])

  return (
    <DialogContent className="overflow-clip pb-2 w-[50hv]">
      <DialogHeader className="flex items-center text-center">
        <div className="rounded-full bg-background p-[6px] text-slate-600 drop-shadow-none transition duration-1000 hover:text-slate-800 hover:drop-shadow-[0_0px_10px_rgba(0,10,50,0.50)] dark:hover:text-slate-400 ">
          <img src={icon} alt="icon" className="h-12 w-12 object-cover" />
        </div>

        <DialogTitle showCloseButton={false} className="flex flex-col items-center gap-2 pt-2">
          Electron Vite ({appInfo.name})
          <span className="flex gap-1 font-mono text-xs font-medium">
            Version {appInfo.version} ({appInfo.arc})
            <span className="font-sans font-medium text-gray-400">
              (
              <span
                className="cursor-pointer text-blue-500"
                onClick={() => open('https://github.com/jigonzalez930209/graf-v3/releases')}
              >
                release notes
              </span>
              )
            </span>
          </span>
        </DialogTitle>

        <DialogDescription className=" text-foreground">
          A plot viewer for TEQ4, TEQ4Z and csv files
        </DialogDescription>

        <span className={cn(`text-xs text-gray-400`, updateContent?.version && 'text-green-400')}>
          {updateText}
        </span>
        <DialogDescription className="flex flex-row"></DialogDescription>
      </DialogHeader>

      <span className="font-mono text-xs font-medium text-gray-400">
        Electron version: {appInfo.electronVersion}
      </span>
      <DialogFooter className="flex flex-row items-center border-t pt-2 text-slate-400 ">
        <div className="mr-auto flex flex-row gap-2">
          <HomeIcon
            className="h-5 w-5 cursor-pointer transition hover:text-slate-300"
            onClick={() => open('https://github.com/jigonzalez930209')}
          />
          <GithubIcon
            className="h-5 w-5 cursor-pointer transition hover:text-slate-300 "
            onClick={() => open('https://github.com/jigonzalez930209/graf-v3')}
          />
        </div>

        {(!updateState || updateState === 'finish') && (
          <Button
            className={buttonVariants({
              variant: 'secondary',
              className: 'h-8 flex flex-row gap-2'
            })}
            onClick={checkUpdates}
          >
            <UpdateIcon /> Check for Updates
          </Button>
        )}
        {updateState === 'success' && (
          <Button
            className={buttonVariants({
              variant: 'default',
              className: 'h-8 flex flex-row gap-2'
            })}
            onClick={downloadUpdate}
          >
            <UpdateIcon /> Download Update
          </Button>
        )}
        {(updateState === 'pending' || updateState === 'inProgress') && (
          <Button
            className={buttonVariants({
              variant: updateState === 'pending' ? 'success' : 'default',
              className: 'h-8'
            })}
            disabled={updateState === 'inProgress'}
            onClick={quitAndInstall}
          >
            <UpdateIcon
              className={cn(updateState === 'inProgress' && 'animate-spin duration-1000')}
            />{' '}
            Install Update and Restart
          </Button>
        )}
        <DialogPrimitive.Close
          className={buttonVariants({
            variant: 'destructive',
            className: 'h-8'
          })}
        >
          Close
        </DialogPrimitive.Close>
      </DialogFooter>
    </DialogContent>
  )
}
