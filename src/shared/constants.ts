import { IGraftImpedanceType, IFileType } from './models/graf'

export const supportedFileTypeObject: { [key: string]: IFileType } = {
  teq4: 'teq4',
  teq4z: 'teq4z',
  csv: 'csv',
  graft: 'graft',
  template: 'template',
  xls: 'xls',
  xlsx: 'xlsx',
  txt: 'txt'
}
export const supportedFileTypesArray = Object.keys(supportedFileTypeObject).map(
  (key) => supportedFileTypeObject[key]
)

export const supportedFileTypes: IFileType[] = [
  'teq4',
  'teq4z',
  'csv',
  'graft',
  'template',
  'xls',
  'xlsx'
]

export const encoding = 'utf8'

const COLORS = [
  '#ff0000',
  '#2f4f4f',
  '#556b2f',
  '#8b4513',
  '#6b8e23',
  '#7f0000',
  '#708090',
  '#483d8b',
  '#008000',
  '#3cb371',
  '#bc8f8f',
  '#008080',
  '#b8860b',
  '#4682b4',
  '#d2691e',
  '#9acd32',
  '#00008b',
  '#32cd32',
  '#7f007f',
  '#8fbc8f',
  '#b03060',
  '#d2b48c',
  '#48d1cc',
  '#9932cc',
  '#ff4500',
  '#ffa500',
  '#ffd700',
  '#ffff00',
  '#c71585',
  '#0000cd',
  '#00ff00',
  '#00fa9a',
  '#dc143c',
  '#00bfff',
  '#f4a460',
  '#0000ff',
  '#a020f0',
  '#f08080',
  '#adff2f',
  '#ff6347',
  '#d8bfd8',
  '#ff00ff',
  '#f0e68c',
  '#6495ed',
  '#dda0dd',
  '#90ee90',
  '#add8e6',
  '#7b68ee',
  '#ee82ee',
  '#7fffd4',
  '#ff69b4'
]

export const PALETTES: Record<string, Array<string>> = {
  '1': [
    '#167288',
    '#8cdaec',
    '#b45248',
    '#d48c84',
    '#a89a49',
    '#d6cfa2',
    '#3cb464',
    '#9bddb1',
    '#643c6a',
    '#836394'
  ],
  '2': [
    '#d8495f',
    '#cc3284',
    '#904493',
    '#8633d0',
    '#5d73d7',
    '#32909e',
    '#328c7b',
    '#41945e',
    '#ae7b38',
    '#d25935'
  ],
  '3': [
    '#03a8a0',
    '#039c4b',
    '#66d313',
    '#fedf17',
    '#ff0984',
    '#21409a',
    '#04adff',
    '#e48873',
    '#f16623',
    '#f44546'
  ],
  '4': [
    '#326cac',
    '#2c6099',
    '#275486',
    '#214873',
    '#1c3c60',
    '#16304c',
    '#112439',
    '#0b1826',
    '#050c13',
    '#000000'
  ],
  '5': [
    '#d0021a',
    '#eaac25',
    '#f1ec18',
    '#7dd41b',
    '#427601',
    '#bbe786',
    '#51e2c1',
    '#4a92d6',
    '#8915ff',
    '#bf0ee0'
  ],
  '6': [
    '#907e63',
    '#c57644',
    '#669264',
    '#8b88f8',
    '#915f6d',
    '#b3abb6',
    '#d1b791',
    '#c5cbe1',
    '#e3eebf',
    '#ebe5d5'
  ],
  '7': [
    '#f9986f',
    '#884400',
    '#7295c9',
    '#00789b',
    '#353d75',
    '#98b489',
    '#b7a2cc',
    '#dcbfac',
    '#dac5b1',
    '#d8dde6'
  ]
  // custom: [],
}

const COLUMNS_IMPEDANCE = ['Time', 'Frequency', 'Module', 'Face', 'ZR', 'ZI']

const COLUMNS_VOLTAMETER = ['Time', 'Voltage', 'Current']

const IMPEDANCE_TYPE: IGraftImpedanceType[] = ['Bode', 'Nyquist', 'ZiZrVsFreq']

const IMPEDANCE_IMPORT_COLUMNS = ['Frequency', 'Module', 'Phase']

export { COLORS, COLUMNS_IMPEDANCE, COLUMNS_VOLTAMETER, IMPEDANCE_TYPE, IMPEDANCE_IMPORT_COLUMNS }
