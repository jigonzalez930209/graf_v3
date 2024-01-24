import { supportedFileTypeObject } from '@shared/constants'

export const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9)
}
export const fileType = (fileName: string) => {
  const ext = fileName.split('.').pop()

  return ext ? supportedFileTypeObject[ext.toLocaleLowerCase()] : undefined
}
