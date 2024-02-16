import { IFileBinary, IFileRaw, IProcessFile } from './models/files'
import { INotification } from './models/graf'

export type SaveProject = (state: string, isSilent?: boolean) => Promise<INotification>
export type SaveExcelFile = (fileName: string, content: ArrayBuffer) => Promise<INotification>
export type SaveTemplate = (template: string) => Promise<INotification>
export type GetBinaryFiles = () => Promise<IFileBinary[] | undefined>

export type GetProject = (isSilent?: boolean) => Promise<IFileRaw>
export type GetFile = () => Promise<IProcessFile>
export type GetFiles = () => Promise<IFileRaw[] | undefined>
export type GetTemplates = () => Promise<IFileRaw[] | undefined>

export type ImportFiles = () => Promise<{ name: string; data: string[][] }[]>

export type ReadFilesFromPath = (path: string[]) => Promise<IFileRaw[]>

export type ImportFilesFromLoader = () => Promise<IFileRaw[] | undefined>
