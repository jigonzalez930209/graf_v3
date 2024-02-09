import useColorsPalette from '@/hooks/useColorsPalette'

import { cn } from '@/utils'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { PALETTES } from '@shared/constants'

const ColorSelectPalette = () => {
  const { updateColorsPalette, colorScheme } = useColorsPalette()

  return (
    <Select onValueChange={(t) => updateColorsPalette(t)} value={colorScheme} defaultValue="1">
      <SelectTrigger>
        <div className="flex w-full items-center">
          {colorScheme !== 'custom' ? (
            PALETTES[colorScheme].map((color, i) => (
              <div
                key={color}
                className={cn(
                  'h-4 w-8',
                  PALETTES[colorScheme].length - 1 === i && 'rounded-r-lg',
                  i === 0 && 'rounded-l-lg'
                )}
                style={{
                  background: color
                }}
              />
            ))
          ) : (
            <div className="h-4 w-full rounded-lg">Custom</div>
          )}
        </div>
      </SelectTrigger>
      <SelectContent className="">
        <div className="w-full items-center">
          {Object.entries(PALETTES).map(([id, palette]) =>
            id === 'custom' ? (
              <SelectItem key={id} value={id} className="w-full min-w-max">
                <div className="flex w-full min-w-max items-center justify-center rounded-lg">
                  Custom
                </div>
              </SelectItem>
            ) : (
              <SelectItem key={id} value={id}>
                <div className="flex w-full">
                  {palette.map((color, i) => (
                    <div
                      key={color}
                      className={cn(
                        'h-4 w-8',
                        palette.length - 1 === i && 'rounded-r-lg',
                        i === 0 && 'rounded-l-lg'
                      )}
                      style={{
                        background: color
                      }}
                    />
                  ))}
                </div>
              </SelectItem>
            )
          )}
        </div>
      </SelectContent>
    </Select>
  )
}

export default ColorSelectPalette
