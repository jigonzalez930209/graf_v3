import * as React from 'react'
import { HelpCircle } from 'lucide-react'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog'
import CustomTooltip from '../ui/tooltip'

import contentList from './content-list'
import ListItem from './list-item'

const HelpDialog = () => {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(contentList[0])

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger>
        <CustomTooltip title="Help" Icon={<HelpCircle className="h-5 w-5" />} />
      </DialogTrigger>
      <DialogContent className="absolute flex h-[91%] max-w-[95%] flex-col gap-0 overflow-x-hidden w-full">
        <DialogTitle className="flex items-center gap-10">Help</DialogTitle>
        <div className="grid grid-cols-9 gap-3 h-[90%] w-full">
          <section className="col-span-2 h-fit bg-secondary p-4">
            <ul className="space-y-4 mt-2">
              {contentList.map((c) => {
                return (
                  <div key={c.label}>
                    <ListItem
                      isSelected={c.label === selected.label}
                      label={c.label}
                      setChecked={() => {
                        setSelected(c)
                      }}
                    />
                    {c?.children && (
                      <ul className="ml-4 space-y-2 mt-2">
                        {c.children.map((child) => {
                          return (
                            <ListItem
                              key={child.label}
                              isSelected={child.label === selected.label}
                              label={child.label}
                              className="text-sm"
                              setChecked={() => {
                                setSelected(child as typeof selected)
                              }}
                            />
                          )
                        })}
                      </ul>
                    )}
                  </div>
                )
              })}
            </ul>
          </section>
          <section className="col-span-7 max-w-[100%] px-3 prose prose-stone dark:prose-invert overflow-auto scrollbar-thumb-rounded-sm scrollbar-w-2 scrollbar-thumb-primary scrollbar scrollbar-track-secondary scrollbar-medium">
            {selected.Content && <selected.Content />}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default HelpDialog
