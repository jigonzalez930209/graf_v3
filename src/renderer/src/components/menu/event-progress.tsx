import { GrafContext } from '@renderer/context/GraftContext'
import React from 'react'
import { ShieldCloseIcon, ShieldEllipsisIcon, ShieldCheckIcon } from 'lucide-react'
import CustomTooltip from '../ui/tooltip'

const icons = {
  error: <ShieldCloseIcon className=" w-5 h-5 text-red-500" />,
  progress: <ShieldEllipsisIcon className=" w-5 h-5 text-blue-500" />,
  success: <ShieldCheckIcon className=" w-5 h-5 text-green-500" />
}

const EventProgress = () => {
  const {
    graftState: { progressEvent },
    setProgressEvent
  } = React.useContext(GrafContext)
  if (!progressEvent.type) return null

  React.useEffect(() => {
    if (!progressEvent.timeOut) return
    const timer = setTimeout(() => {
      setProgressEvent({ type: undefined, name: '', message: '', timeOut: undefined })
    }, progressEvent.timeOut || 10000)
    return () => clearTimeout(timer)
  }, [progressEvent])

  return (
    <span className="mr-40 ml-auto">
      <CustomTooltip
        title={progressEvent.name}
        content={progressEvent.message}
        Icon={icons[progressEvent.type]}
      />
    </span>
  )
}

export default EventProgress
