import { FlateErrorCode, Unzip, UnzipInflate } from 'fflate'

/** Shown when fflate hits the end of a truncated archive. */
export const INCOMPLETE_MEDIA_ZIP_MESSAGE =
  'Plik ZIP jest niekompletny — odczyt urwał się przed końcem archiwum. Pobierz plik ponownie w całości i wskaż go jeszcze raz.'

export class IncompleteMediaZipError extends Error {
  constructor() {
    super(INCOMPLETE_MEDIA_ZIP_MESSAGE)
    this.name = 'IncompleteMediaZipError'
  }
}

export type ZipReadProgress = {
  bytesRead: number
  totalBytes: number | null
  filesProcessed: number
  stored: number
}

const flateCode = (error: unknown): number | undefined => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = error.code
    if (typeof code === 'number') {
      return code
    }
  }
  return undefined
}

/**
 * fflate raises UnexpectedEOF (code 0) when inflate hits the end of a member
 * that was cut off, and InvalidZipData (code 13) when the last chunk arrives
 * while a local file still expects more bytes. Both mean the chosen file is
 * not a finished archive.
 */
export function normalizeZipReadError(error: unknown): Error {
  if (error instanceof IncompleteMediaZipError) {
    return error
  }
  const code = flateCode(error)
  const message = error instanceof Error ? error.message : String(error)
  const truncated =
    code === FlateErrorCode.UnexpectedEOF ||
    code === FlateErrorCode.InvalidZipData ||
    /unexpected eof/i.test(message) ||
    /invalid zip data/i.test(message)
  if (truncated) {
    return new IncompleteMediaZipError()
  }
  if (error instanceof Error) {
    return error
  }
  return new Error(message)
}

export function pushZipChunk(unzip: Unzip, chunk: Uint8Array, final: boolean): void {
  try {
    unzip.push(chunk, final)
  } catch (error) {
    throw normalizeZipReadError(error)
  }
}

/** Reads one buffer as a finished zip stream. Used to detect a cut-off archive. */
export function ingestZipBytes(bytes: Uint8Array): void {
  const unzip = new Unzip()
  unzip.register(UnzipInflate)
  let failure: Error | null = null
  unzip.onfile = (file) => {
    file.ondata = (error) => {
      if (error) {
        failure = normalizeZipReadError(error)
      }
    }
    try {
      file.start()
    } catch (error) {
      failure = normalizeZipReadError(error)
    }
  }
  pushZipChunk(unzip, bytes, true)
  if (failure) {
    throw failure
  }
}

const formatByteSize = (bytes: number): string => {
  if (bytes >= 1_000_000_000) {
    return `${(bytes / 1_000_000_000).toFixed(1).replace('.', ',')} GB`
  }
  if (bytes >= 1_000_000) {
    return `${(bytes / 1_000_000).toFixed(1).replace('.', ',')} MB`
  }
  if (bytes >= 1_000) {
    return `${Math.round(bytes / 1_000)} KB`
  }
  return `${bytes} B`
}

/** Status line shown while the archive is read and images are stored. */
export function formatZipReadProgress(progress: ZipReadProgress): string {
  const saved = `zapisane zdjęcia: ${progress.stored}, przejrzane pliki: ${progress.filesProcessed}`
  if (progress.totalBytes != null && progress.totalBytes > 0) {
    const percent = Math.min(100, Math.floor((progress.bytesRead / progress.totalBytes) * 100))
    return `Odczyt archiwum… ${percent}% (${formatByteSize(progress.bytesRead)} z ${formatByteSize(progress.totalBytes)}). ${saved}.`
  }
  return `Odczyt archiwum… ${formatByteSize(progress.bytesRead)}. ${saved}.`
}
