'use client'

import * as React from 'react'
import { ImportIcon, SaveIcon, SettingsIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from '@/components/ui/menubar'
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { GrafContext } from '@/context/GraftContext'
import { AboutDialog } from './about-dialog'
import { Settings } from './settings'
import ExportModal from '../export-dialog'
import FrequencyAnalysisDialog from '../frequency-analysis/frequency-analysis-dialog'
import ImportFile from '../import-dialog'
import ImportDialog from '../template-dialog/import-dialog'
import { Dialog, DialogTrigger } from '../ui/dialog'
import CustomTooltip from '../ui/tooltip'
import { MenuModeToggle } from './menu-mode-toggle'
import { ProjectMenu } from './project'
import EventProgress from './event-progress'

export function Menu() {
  const [name, setName] = React.useState('')
  const {
    graftState: { fileType, files }
  } = React.useContext(GrafContext)

  const progress = React.useRef(0)

  const quit = React.useCallback(() => {
    window.context.quit()
  }, [])

  const openDevTools = React.useCallback(async () => {
    await window.context.openDevTools()
  }, [])

  const updateStatus = React.useMemo(() => {}, [progress.current])

  React.useEffect(() => {
    window.context.getAppName().then((name) => setName(name))
    updateStatus
    window.context.on('download-progress', (_, arg) => {
      progress.current = arg.percent
    })
  }, [])

  return (
    <>
      <Menubar className="z-50 w-full rounded-none border-none pl-2 lg:pl-3">
        <MenubarMenu>
          <MenubarTrigger className="mx-auto min-w-max font-bold capitalize hover:bg-secondary">
            {name}
          </MenubarTrigger>
          <Dialog modal={false}>
            <MenubarContent>
              <MenubarSeparator />
              <MenubarItem onClick={openDevTools}>Open Dev Tools</MenubarItem>
              <DialogTrigger asChild>
                <MenubarItem>About {name}</MenubarItem>
              </DialogTrigger>
              <MenubarSeparator />
              <MenubarShortcut />
              <MenubarItem onClick={quit}>Quit</MenubarItem>
            </MenubarContent>
            <AboutDialog />
          </Dialog>
        </MenubarMenu>
        <ProjectMenu />

        <MenuModeToggle />
        <div className="flex w-full gap-3 pl-4">
          <Popover>
            <PopoverTrigger>
              <CustomTooltip title="Settings" Icon={<SettingsIcon className="h-5 w-5" />} />
            </PopoverTrigger>
            <PopoverContent className="h-auto w-auto bg-secondary">
              <Settings />
              <PopoverArrow className="fill-primary" />
            </PopoverContent>
          </Popover>

          <FrequencyAnalysisDialog />
          <ImportDialog />
          <ImportFile />
          {Boolean(files.find((f) => f.type === 'teq4' || f.type === 'teq4z')) && files.length && (
            <ExportModal>
              <CustomTooltip title="Export to Excel" Icon={<SaveIcon className="h-5 w-5" />} />
            </ExportModal>
          )}
          <EventProgress />
        </div>
      </Menubar>
      <div className="w-full h-[1.5px] ">
        <div
          className="bg-primary h-[1.5px] "
          style={{ transform: `translateX(-${100 - (progress.current || 100)}%)` }}
        ></div>
      </div>
    </>
  )
}
