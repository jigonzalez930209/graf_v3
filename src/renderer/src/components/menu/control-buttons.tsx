import * as React from 'react'
import { Minus, Maximize2, Minimize2, X } from 'lucide-react'
import { GrafContext } from '@renderer/context/GraftContext'

const WindowControls = () => {
  const [isMaximized, setIsMaximized] = React.useState(false)
  const { graftState } = React.useContext(GrafContext)
  const handleQuit = () => {
    window.context.saveProject(JSON.stringify(graftState), true).then(() => {
      window.context.quit()
    })
  }

  const handleMaximize = async () => {
    setIsMaximized(await window.context.maximize())
  }

  const handleMinimize = () => {
    window.context.minimize()
  }

  return (
    <div className="flex space-x-2 ml-auto pr-3">
      <button className="p-2 rounded-full hover:bg-secondary" onClick={handleMinimize}>
        <Minus size={16} />
      </button>
      <button className="p-2 rounded-full hover:bg-secondary" onClick={handleMaximize}>
        {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>
      <button className="p-2 rounded-full hover:bg-red-500" onClick={handleQuit}>
        <X size={16} />
      </button>
    </div>
  )
}

export default WindowControls
