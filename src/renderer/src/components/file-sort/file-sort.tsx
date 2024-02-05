import * as React from 'react'
import { GrafContext } from '@/context/GraftContext'
import { useData } from '@/hooks/useData'
import { ChevronLeft, ChevronRight, GroupIcon, UngroupIcon } from 'lucide-react'
import { useSnackbar } from 'notistack'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

import Container from './container'
import Item from './item'
import List from './list'
import { GroupedFiles } from '@shared/models/files'

type FileSortProps = {
  maxHeight?: string
  children?: React.ReactNode
  groupedFiles: GroupedFiles
}

const FileSort = (props: FileSortProps) => {
  const {
    graftState: { isFilesGrouped, files }
  } = React.useContext(GrafContext)
  const { maxHeight, children, groupedFiles } = props

  const { changeSelectedFile } = useData()
  const { enqueueSnackbar } = useSnackbar()

  const handleFileSelectedChange = React.useCallback(
    (id: string) => {
      try {
        changeSelectedFile(id)
      } catch (e) {
        enqueueSnackbar(`You can't select more than 10 files`, {
          variant: 'warning'
        })
      }
    },
    [files]
  )

  return (
    <Container maxHeight={maxHeight} className="relative">
      <div className="py-2">
        {isFilesGrouped ? (
          <Accordion type="single" collapsible className="w-full px-3">
            <AccordionItem value="teq4">
              <AccordionTrigger>TEQ4</AccordionTrigger>
              <AccordionContent>
                <List>
                  {groupedFiles.teq4.map((file) => (
                    <Item key={file.id} file={file} setFile={handleFileSelectedChange} />
                  ))}
                </List>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="teq4z">
              <AccordionTrigger>TEQ4Z</AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col space-y-3 text-center sm:text-left">
                  {groupedFiles.teq4Z.map((file) => (
                    <Item key={file.id} file={file} setFile={handleFileSelectedChange} />
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="CSV">
              <AccordionTrigger>CSV</AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col space-y-3 text-center sm:text-left">
                  {groupedFiles.csv.map((file) => (
                    <Item key={file.id} file={file} setFile={handleFileSelectedChange} />
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <List className="px-3">
            {files.map((file) => (
              <Item key={file.id} file={file} setFile={handleFileSelectedChange} />
            ))}
          </List>
        )}
        {children}
      </div>
    </Container>
  )
}

export default FileSort
