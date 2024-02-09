import { IProcessFile } from '@shared/models/files'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import SelectedItem from './items'

export type FilesTabsProps = {
  selectedTab: 'teq4' | 'teq4z'
  filesByTabs: {
    teq4: IProcessFile[]
    teq4z: IProcessFile[]
  }
  onChangeSelectedFiles: (id: string, selected: boolean) => void
  onChangeTabs: (e: string) => void
}
const FilesTabs = ({
  selectedTab,
  filesByTabs,
  onChangeTabs,
  onChangeSelectedFiles
}: FilesTabsProps) => {
  return (
    <Tabs
      defaultValue={selectedTab}
      value={selectedTab}
      onValueChange={onChangeTabs}
      className="w-[240px] max-h-[50vh]"
    >
      <TabsList>
        <TabsTrigger value="teq4">teq4</TabsTrigger>
        <TabsTrigger value="teq4z">teq4z</TabsTrigger>
      </TabsList>
      <TabsContent value="teq4">
        <ul className="h-[45vh] flex flex-col gap-2 p-1 overflow-auto scrollbar-thumb-rounded-sm scrollbar-w-2 scrollbar-thumb-primary scrollbar scrollbar-track-secondary scrollbar-medium ">
          {filesByTabs.teq4.map((f) => (
            <SelectedItem
              key={`file-${f.id}`}
              name={f.name}
              id={f.id}
              idPrefix="file-"
              isSelected={!!f.selected}
              setChecked={onChangeSelectedFiles}
              color={f.color}
            />
          ))}
        </ul>
      </TabsContent>
      <TabsContent value="teq4z">
        <ul className="h-[45vh] flex flex-col gap-2 p-1 overflow-auto scrollbar-thumb-rounded-sm scrollbar-w-2 scrollbar-thumb-primary scrollbar scrollbar-track-secondary scrollbar-medium ">
          {filesByTabs.teq4z.map((f) => (
            <SelectedItem
              key={`file-${f.id}`}
              name={f.name}
              id={f.id}
              idPrefix="file-"
              isSelected={!!f.selected}
              setChecked={onChangeSelectedFiles}
              color={f.color}
            />
          ))}
        </ul>
      </TabsContent>
    </Tabs>
  )
}
export default FilesTabs
