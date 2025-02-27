import { LoaderContext } from '@renderer/context/Loading'
import React from 'react'

const useLoader = () => {
  const context = React.useContext(LoaderContext)
  if (context === null) {
    throw new Error('useLoader must be used within a LoaderProvider')
  }
  return context
}

export default useLoader
