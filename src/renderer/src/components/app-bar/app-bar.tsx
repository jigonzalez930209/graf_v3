import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'

import { Button } from '@/components/ui/button'
import { Popover as CustomPopover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { GrafContext } from '@/context/GraftContext'
import ExportModal from '../export-dialog'
import FrequencyAnalysisDialog from '../frequency-analysis/frequency-analysis-dialog'
import { Settings } from '../menu/settings'

const Bar: React.FC = () => {
  const {
    graftState: { fileType }
  } = React.useContext(GrafContext)

  return <div></div>
}

export default Bar
