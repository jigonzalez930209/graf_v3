import { GroupIcon, UngroupIcon } from 'lucide-react'
import { Button } from '../ui/button'

type GroupFilesProps = {
  isFilesGrouped: boolean
  handleChangeGroupedFiles: () => void
}
const GroupFiles = (props: GroupFilesProps) => {
  const { isFilesGrouped, handleChangeGroupedFiles } = props

  return (
    <Button variant="ghost" size="icon" onClick={() => handleChangeGroupedFiles()}>
      {isFilesGrouped ? (
        <UngroupIcon className="h-5 w-5 text-primary" />
      ) : (
        <GroupIcon className="h-5 w-5 text-primary" />
      )}
    </Button>
  )
}

export default GroupFiles
