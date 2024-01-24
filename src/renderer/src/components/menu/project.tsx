import * as React from 'react'
import { GrafContext } from '@/context/GraftContext'
import { useData } from '@/hooks/useData'

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from '../ui/menubar'
import { useToast } from '../ui/use-toast'
import { add } from 'lodash'
import { readGrafFile, readNativeFiles, stringifyToSave } from '@renderer/utils/connectors'
import { IGraftState } from '@shared/models/graf'
import { enqueueSnackbar } from 'notistack'

export const ProjectMenu = () => {
  const { graftState, setGraftState } = React.useContext(GrafContext)
  const [loading, setLoading] = React.useState(false)
  const t = useToast()
  const { addFiles } = useData()

  const addNewProject = () => {}

  const readFiles = React.useCallback(async () => {
    setLoading(true)

    window.context
      .getFiles()
      .then((files) => {
        if (files === undefined || files.length === 0) {
          enqueueSnackbar('No files selected', { variant: 'warning' })
          return
        }
        const processFiles = readNativeFiles(files)
        if (processFiles) {
          addFiles(processFiles)
        } else {
          enqueueSnackbar('Something went wrong read the files', { variant: 'error' })
        }
      })
      .catch((err) => {
        enqueueSnackbar(err.toString(), { variant: 'error' })
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const openProject = React.useCallback(async () => {
    setLoading(true)
    window.context
      .getGrafState()
      .then((state) => {
        if (state.type === 'graft') {
          const currentState = readGrafFile(state)
          if (currentState) setGraftState(currentState)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const openDevTools = React.useCallback(async () => {
    await window.context.openDevTools()
  }, [])

  const saveProject = React.useCallback(async () => {
    setLoading(true)
    window.context
      .saveProject(stringifyToSave<IGraftState>(graftState, 'graft'))
      .then((n) => {
        enqueueSnackbar(n.content, { variant: n.type })
      })
      .catch((err) => {
        enqueueSnackbar(err.toString(), { variant: 'error' })
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [graftState])

  return (
    <MenubarMenu>
      <MenubarTrigger className="relative hover:bg-secondary">Project</MenubarTrigger>
      <MenubarContent>
        {/* TODO: Implement handle project in next versions */}
        <MenubarItem disabled onClick={addNewProject}>
          New
          {/* <MenubarShortcut>⌘N</MenubarShortcut> */}
        </MenubarItem>
        <MenubarItem onClick={readFiles}>
          Open files
          {/* <MenubarShortcut>⌘O</MenubarShortcut> */}
        </MenubarItem>
        <MenubarItem onClick={readFiles}>
          Add files
          {/* <MenubarShortcut>⌘O</MenubarShortcut> */}
        </MenubarItem>

        <MenubarItem disabled>
          Save
          {/* <MenubarShortcut>⌘S</MenubarShortcut> */}
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onClick={openProject}>
          Import project
          <MenubarShortcut>⌘I</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onClick={saveProject}>
          Save project
          <MenubarShortcut>⌘E</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onClick={openDevTools}>
          Open Dev Tools
          <MenubarShortcut>⌘I</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
