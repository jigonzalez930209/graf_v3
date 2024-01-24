import React, { useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { UpdateIcon } from '@radix-ui/react-icons'
import { GithubIcon, HomeIcon } from 'lucide-react'

import icon from '../../src/assets/graph-icon.png'
import { Button, buttonVariants } from './ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog'

export function AboutDialog() {
  const [updateText, setUpdateText] = useState('')
  const [version, setVersion] = useState('')
  const [name, setName] = useState('')
  const [electronVersion, setElectronVersion] = useState('')
  const [arc, setArc] = useState('')

  const handleInitialState = React.useCallback(async () => {
    const { version, name, electronVersion, arc } = await window.context.getAppInfo()
    setVersion(version)
    setName(name)
    setElectronVersion(electronVersion)
    setArc(arc)
  }, [])

  React.useEffect(() => {
    handleInitialState()
  }, [handleInitialState])

  return (
    <DialogContent className="overflow-clip pb-2">
      <DialogHeader className="flex items-center text-center">
        <div className="rounded-full bg-background p-[6px] text-slate-600 drop-shadow-none transition duration-1000 hover:text-slate-800 hover:drop-shadow-[0_0px_10px_rgba(0,10,50,0.50)] dark:hover:text-slate-400 ">
          <img src={icon} alt="icon" className="h-12 w-12 object-cover" />
        </div>

        <DialogTitle showCloseButton={false} className="flex flex-col items-center gap-2 pt-2">
          Electron Vite ({name})
          <span className="flex gap-1 font-mono text-xs font-medium">
            Version {version} ({arc})
            <span className="font-sans font-medium text-gray-400">
              (
              <span
                className="cursor-pointer text-blue-500"
                onClick={() => open('https://github.com/jigonzalez930209/graf-v2/releases')}
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

        <span className="text-xs text-gray-400">{updateText}</span>
        <DialogDescription className="flex flex-row"></DialogDescription>
      </DialogHeader>

      <span className="font-mono text-xs font-medium text-gray-400">
        Electron version: {electronVersion}
      </span>
      <DialogFooter className="flex flex-row items-center border-t pt-2 text-slate-400 ">
        <div className="mr-auto flex flex-row gap-2">
          <HomeIcon
            className="h-5 w-5 cursor-pointer transition hover:text-slate-300"
            onClick={() => open('https://github.com/jigonzalez930209')}
          />
          <GithubIcon
            className="h-5 w-5 cursor-pointer transition hover:text-slate-300 "
            onClick={() => open('https://github.com/jigonzalez930209/graf-v2')}
          />
        </div>

        <Button
          type="submit"
          variant="outline"
          className="h-7 gap-1"
          onClick={() => setUpdateText('You have the latest version.')}
        >
          <UpdateIcon /> Check for Updates
        </Button>
        <DialogPrimitive.Close
          type="submit"
          className={buttonVariants({ variant: 'ghost', className: 'h-7' })}
        >
          Close
        </DialogPrimitive.Close>
      </DialogFooter>
    </DialogContent>
  )
}
