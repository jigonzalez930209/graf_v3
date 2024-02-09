import React from 'react'
import { GrafContext } from '@/context/GraftContext'
import { COLUMNS_IMPEDANCE, COLUMNS_VOLTAMETER, cn } from '@/utils'

import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { IProcessFile } from '@shared/models/files'
import { exportExcelImpedance, exportExcelVoltametry } from '@renderer/utils/common'
import { enqueueSnackbar } from 'notistack'
import { Switch } from '../ui/switch'
import SelectedItem from './items'
import FilesTabs, { FilesTabsProps } from './files-by-tabs'

type ExportDialogProps = {
  children?: React.ReactNode
}

const ExportDialog = ({ children }: ExportDialogProps) => {
  const {
    graftState: { files: filesState, fileType }
  } = React.useContext(GrafContext)

  const [selectedTab, setSelectedTab] = React.useState<'teq4' | 'teq4z'>(
    (fileType as 'teq4' | 'teq4z') || 'teq4'
  )

  const [columnsState, setColumnsState] = React.useState({
    teq4z: COLUMNS_IMPEDANCE.reduce((acc, curr) => ({ ...acc, [curr]: true }), {}),
    teq4: COLUMNS_VOLTAMETER.reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
  })

  const [filesByTabs, setFilesByTabs] = React.useState<{
    teq4: IProcessFile[]
    teq4z: IProcessFile[]
  }>({
    teq4: filesState.filter((file) => file.type === 'teq4'),
    teq4z: filesState.filter((file) => file.type === 'teq4z')
  })

  const [isSameSheet, setIsSameSheet] = React.useState(true)
  const [filename, setFilename] = React.useState('')

  const [open, setOpen] = React.useState(false)

  const handleChange = (id: string, c: boolean) => {
    if (selectedTab === 'teq4') {
      setColumnsState({
        ...columnsState,
        teq4: {
          ...columnsState.teq4,
          [id]: c
        }
      })
    } else {
      setColumnsState({
        ...columnsState,
        teq4z: {
          ...columnsState.teq4z,
          [id]: c
        }
      })
    }
  }

  const handleSelectFiles = (id: string, selected: boolean) => {
    if (selectedTab === 'teq4') {
      setFilesByTabs({
        ...filesByTabs,
        teq4: filesByTabs.teq4.map((f) => (f.id === id ? { ...f, selected } : f))
      })
    } else {
      setFilesByTabs({
        ...filesByTabs,
        teq4z: filesByTabs.teq4z.map((f) => (f.id === id ? { ...f, selected } : f))
      })
    }
  }

  const error =
    (columnsState?.[selectedTab] &&
      !Object.values(columnsState?.[selectedTab])?.find((c) => c === true)) ||
    filename.length < 3 ||
    !filesByTabs[selectedTab].find((f) => f.selected)

  const handleExport = async () => {
    if (selectedTab === 'teq4') {
      const dataBlob = await exportExcelVoltametry({
        files: filesByTabs.teq4.filter((c) => c.selected),
        sameSheet: isSameSheet, // Add the missing 'sameSheet' property
        columns: Object.entries(columnsState.teq4)
          .filter(([_, v]) => v)
          .map(([k, _]) => k)
      })
      window.context
        .saveExcelFile(filename, dataBlob)
        .then((notification) => {
          enqueueSnackbar(notification.content, { variant: notification.type })
        })

        .catch(console.error)
    } else {
      const dataBlob = await exportExcelImpedance({
        files: filesByTabs.teq4z.filter((c) => c.selected),
        sameSheet: isSameSheet, // Add the missing 'sameSheet' property
        columns: Object.entries(columnsState.teq4z)
          .filter(([_, v]) => v)
          .map(([k, _]) => k)
      })
      window.context
        .saveExcelFile(filename, dataBlob)
        .then((notification) => {
          enqueueSnackbar(notification.content, { variant: notification.type })
        })

        .catch(console.error)
    }
  }

  React.useEffect(() => {
    setFilesByTabs({
      teq4: filesState.filter((file) => file.type === 'teq4'),
      teq4z: filesState.filter((file) => file.type === 'teq4z')
    })
    setSelectedTab(fileType === 'teq4' ? 'teq4' : 'teq4z')
  }, [open])

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="h-[80%]">
        <DialogTitle showCloseButton={false}>Select a columns to export</DialogTitle>
        {open && (
          <div className="flex flex-row gap-4 w-[100%] ">
            <div className="flex flex-col gap-3 mt-2">
              <label>Select columns to save</label>
              <div className="flex w-full flex-col gap-4">
                {selectedTab === 'teq4z' && (
                  <ul className="flex flex-col gap-2 my-1 py-1">
                    {COLUMNS_IMPEDANCE.map((column) => (
                      <SelectedItem
                        key={column}
                        name={column}
                        id={column}
                        idPrefix="column-"
                        isSelected={columnsState[selectedTab][column]}
                        setChecked={handleChange}
                      />
                    ))}
                  </ul>
                )}
                {selectedTab === 'teq4' && (
                  <ul className="flex flex-col gap-2 my-1 py-1">
                    {COLUMNS_VOLTAMETER.map((column) => (
                      <SelectedItem
                        key={column}
                        name={column}
                        id={column}
                        idPrefix="column-"
                        isSelected={columnsState[selectedTab][column]}
                        setChecked={handleChange}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div>
              <FilesTabs
                onChangeTabs={(e) => setSelectedTab(e as FilesTabsProps['selectedTab'])}
                selectedTab={selectedTab}
                filesByTabs={filesByTabs}
                onChangeSelectedFiles={handleSelectFiles}
              />
            </div>
          </div>
        )}
        <div className="flex gap-3 bg-background">
          <div>
            <div>File Name</div>
            <Input
              className="max-w-max rounded-md mt-2 border border-gray-300 p-2"
              value={filename}
              placeholder="Please enter a file name"
              onChange={(e) => setFilename(e.target.value)}
              name="filename"
            />
          </div>
          <div className=" ">
            <div>Same Sheet</div>
            <Switch
              id="same-sheet"
              className="mt-2"
              checked={isSameSheet}
              onCheckedChange={() => setIsSameSheet((prev) => !prev)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant={error ? 'outline' : 'success'} disabled={error} onClick={handleExport}>
            {!error ? 'Save File' : 'Error'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExportDialog
