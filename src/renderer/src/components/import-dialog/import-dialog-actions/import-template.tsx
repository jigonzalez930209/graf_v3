import * as React from 'react'
import { Template, TemplateList, TemplateListItem } from '@/utils/import-dialog-interfaces'
import { PlusIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'

import FileListSelector from './file-list-selector'
import { generateRandomId } from '@renderer/utils/common'

type ImportTemplateProps = {
  selectedTemplate: TemplateListItem | undefined
  setSelectedTemplate: React.Dispatch<React.SetStateAction<TemplateListItem | undefined>>
  templates: TemplateList
  setTemplates: React.Dispatch<React.SetStateAction<TemplateList | []>>
}

const ImportTemplate = ({
  selectedTemplate,
  setSelectedTemplate,
  templates,
  setTemplates
}: ImportTemplateProps) => {
  const handleImport = React.useCallback(async () => {
    await window.context.getTemplates().then((templates) => {
      if (templates === undefined || templates.length === 0) {
        return undefined
      }
      const processedTemplates = templates.map(
        (template) =>
          ({
            id: generateRandomId(),
            name: template.name,
            template: JSON.parse(template.content) as Template
          }) as TemplateListItem
      )
      setTemplates(processedTemplates)
    })
  }, [])

  return (
    <div>
      <FileListSelector
        items={templates}
        selectedItem={selectedTemplate}
        setSelectedItem={setSelectedTemplate}
        title="Templates Selected "
      />
      <Button onClick={handleImport} className="w-3/4">
        <PlusIcon className="h-5 w-5" />
        <span>Select Templates</span>
      </Button>
    </div>
  )
}

export default ImportTemplate
