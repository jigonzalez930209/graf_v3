import * as React from 'react'

export type LoaderContextProps = {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

export const LoaderContext = React.createContext<LoaderContextProps | null>(null)

interface LoaderProviderProps {
  children: React.ReactNode
}

export const LoaderProvider = ({ children }: LoaderProviderProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const startLoading = React.useCallback(() => {
    setIsLoading(true)
  }, [])

  const stopLoading = React.useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <LoaderContext.Provider
      value={{
        isLoading,
        startLoading,
        stopLoading
      }}
    >
      {children}
    </LoaderContext.Provider>
  )
}
