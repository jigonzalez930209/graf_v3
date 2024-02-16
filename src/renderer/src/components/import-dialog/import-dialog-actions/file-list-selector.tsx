import React from 'react'
import { FileIcon } from 'lucide-react'

import { cn } from '@/utils'

type FileListSelectorProps<T> = {
  items: (T & { name: string })[]
  selectedItem: T | undefined
  setSelectedItem: React.Dispatch<React.SetStateAction<T | undefined>>
  title: string
}

const FileListSelector = <T,>({
  selectedItem,
  setSelectedItem,
  items,
  title
}: FileListSelectorProps<T>) => {
  return (
    <div className="mb-3 flex h-[34vh] w-full select-none flex-col space-y-2 overflow-y-auto px-1 pb-2 ">
      <div className="sticky top-0 rounded-md font-bold">
        {' '}
        {items?.length < 1 ? `Not ${title}` : title}
      </div>
      {items?.length > 0 &&
        items.map((f) => (
          <div
            key={f?.name}
            className={cn(
              'flex cursor-pointer items-center rounded-md border p-2',
              'hover:shadow-sm hover:ring-1',
              f?.name === selectedItem ? 'bg-secondary' : ''
            )}
            onClick={() => setSelectedItem(f)}
          >
            <FileIcon className="mr-2 h-5 w-5" />
            <span>{f?.name}</span>
          </div>
        ))}
    </div>
  )
}

export default FileListSelector
