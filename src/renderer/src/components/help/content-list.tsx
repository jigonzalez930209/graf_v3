import HandleFiles from './content/handle-files/handle-files.mdx'
import Teq4 from './content/handle-files/teq4/content.mdx'
import Teq4z from './content/handle-files/teq4z/content.mdx'
import Csv from './content/handle-files/csv/content.mdx'
import Menu from './content/menu/content.mdx'
import AutoUpdate from './content/menu/atoupdate/content.mdx'
import Project from './content/menu/project/content.mdx'
import ExportFiles from './content/menu/export-files/content.mdx'
import FrequencyAnalysis from './content/menu/freq-analysis/content.mdx'
import Import from './content/menu/import/content.mdx'
import Settings from './content/menu/settings/content.mdx'
import Templates from './content/menu/templates/content.mdx'

const contentList = [
  {
    label: 'Handle Files',
    Content: HandleFiles,
    children: [
      {
        label: 'Teq4',
        Content: Teq4
      },

      {
        label: 'Teq4z',
        Content: Teq4z
      },
      {
        label: 'csv',
        Content: Csv
      }
    ]
  },
  {
    label: 'Menu',
    Content: Menu,
    children: [
      {
        label: 'Auto Update',
        Content: AutoUpdate
      },
      {
        label: 'Project',
        Content: Project
      },
      {
        label: 'Export Files',
        Content: ExportFiles
      },
      {
        label: 'Frequency analysis',
        Content: FrequencyAnalysis
      },
      {
        label: 'Import using templates',
        Content: Import
      },
      {
        label: 'Settings',
        Content: Settings
      },
      {
        label: 'Templates ',
        Content: Templates
      }
    ]
  }
]

export default contentList
