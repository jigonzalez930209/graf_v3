import * as React from 'react'
import { CandlestickChartIcon, ChevronDown, ChevronUp } from 'lucide-react'

import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog'
import CustomTooltip from '../ui/tooltip'
import ExportToExcel from './export-excel'
import ParameterInput from './parameter-input'
import PlotContainer from './plot-container'
import { ScrollArea } from '../ui/scroll-area'

const FrequencyAnalysisDialog = () => {
  const [openInputs, setOpenInputs] = React.useState(true)
  return (
    <Dialog>
      <DialogTrigger>
        <CustomTooltip
          title="Frequency Analysis"
          Icon={<CandlestickChartIcon className="h-5 w-5" />}
        />
      </DialogTrigger>
      <DialogContent className="h-[93%] max-w-[95%] gap-0 overflow-y-auto overflow-x-hidden mt-5">
        <DialogTitle className="mb-1 flex h-6 w-full items-center gap-6 p-0">
          <div>Frequency Analysis</div>
          <ExportToExcel />
        </DialogTitle>

        {openInputs && <ParameterInput />}
        <Button
          variant="ghost"
          size="icon"
          className="my-2 inline-flex h-2.5 w-full cursor-pointer items-center  justify-center rounded-b"
          asChild
          onClick={() => setOpenInputs((prev) => !prev)}
        >
          {openInputs ? (
            <ChevronUp className="h-[15px] w-[15px] text-primary" />
          ) : (
            <ChevronDown className="h-[15px] w-[15px] text-primary" />
          )}
        </Button>
        <ScrollArea viewPortClassName="h-full" className="overflow-hidden bg-primary-foreground/5">
          <PlotContainer />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
export default FrequencyAnalysisDialog
