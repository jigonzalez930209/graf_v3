// export {
//   Utf8ArrayToStr,
//   // clearStorage,
//   // initStorage,
//   openProject,
//   readAllFiles,
//   readFileContents,
//   readFilesUsingTauriProcess,
//   saveProject
//   // saveStorage
// } from './tauri.tsNotUse'
export { COLORS, COLUMNS_IMPEDANCE, COLUMNS_VOLTAMETER, PALETTES } from '@shared/constants'
// export { extractSerialPoint, fileType } from './common'
// export {
//   readAllFilesUsingJS,
//   readAllFilesUsingWebProcess,
//   readAllWebProcess,
//   readFileContentsUsingJS
// } from './web.tsNotUse'

import clsx, { ClassValue } from 'clsx'
import { UseThemeProps } from 'next-themes/dist/types'
import { twMerge } from 'tailwind-merge'

export const cn = (...args: ClassValue[]): string => {
  return twMerge(clsx(...args))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export const defaultTheme = (t: UseThemeProps): 'dark' | 'light' => {
  if (t.theme === 'system') return t?.systemTheme || 'dark'
  return t.resolvedTheme === 'light' ? 'light' : 'dark'
}
