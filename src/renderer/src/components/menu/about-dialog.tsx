import React, { useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { GithubIcon, HomeIcon } from 'lucide-react'

import icon from '@/assets/graph-icon.png'
import { buttonVariants } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { GrafContext } from '@renderer/context/GraftContext'
import { cn } from '@renderer/utils'

export function AboutDialog() {
  const {
    graftState: { updateContent }
  } = React.useContext(GrafContext)

  const [updateText, setUpdateText] = useState('')

  const [appInfo, setAppInfo] = useState({
    version: '',
    name: '',
    electronVersion: '',
    arc: ''
  })

  React.useEffect(() => {
    window.context.getAppInfo().then(({ version, name, electronVersion, arc }) => {
      setAppInfo({ version, name, electronVersion, arc })
    })
    if (updateContent?.version) {
      setUpdateText(
        `New version available version ${updateContent.version} \n please restart the app to apply the update`
      )
      return
    }
    setUpdateText('Please check for updates...')
  }, [updateContent])

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
              <span
                className="cursor-pointer text-blue-500 mx-3"
                onClick={() => open('https://github.com/jigonzalez930209/graf_v3/releases')}
              >
                release notes {'  '}
              </span>
              <span
                className="cursor-pointer text-blue-500"
                onClick={() => open('https://github.com/jigonzalez930209/graf_v3/issues')}
              >
                issues
              </span>
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
            onClick={() => open('https://github.com/jigonzalez930209/graf_v3')}
          />
        </div>

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
