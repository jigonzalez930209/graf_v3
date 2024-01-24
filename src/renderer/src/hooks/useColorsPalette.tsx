import React from 'react'

import { GrafContext } from '../context/GraftContext'
import { PALETTES } from '@shared/constants'

const useColorsPalette = () => {
  const {
    graftState: { files, colorScheme },
    setColorScheme,
    updateFile
  } = React.useContext(GrafContext)

  const updateFileColors = (id: string, color: string) => {
    const selectedFile = files.find((file) => file.id === id)
    if (selectedFile) {
      updateFile({ ...selectedFile, color })
    } else {
      throw new Error('File not found')
    }
  }

  const updateColorsPalette = (paletteId: string) => {
    const selectedPalette = PALETTES[paletteId]
    setColorScheme(paletteId)
    const selectedFiles = files.filter((file) => file.selected)

    if (selectedPalette && selectedFiles?.length > 0) {
      selectedFiles.map(
        (file) =>
          file.selected &&
          updateFile({
            ...file,
            color: selectedPalette[parseInt(file.selected.toString())]
          })
      )
    } else {
      throw new Error('Palette not found')
    }
  }

  return { updateFileColors, updateColorsPalette, colorScheme }
}

export default useColorsPalette
