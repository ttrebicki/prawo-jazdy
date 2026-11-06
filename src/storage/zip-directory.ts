import { inflateSync } from 'fflate'

const SIG_EOCD = 0x06054b50
const SIG_EOCD64 = 0x06064b50
const SIG_LOCATOR64 = 0x07064b50
const SIG_CENTRAL = 0x02014b50
const SIG_LOCAL = 0x04034b50
const ZIP64_EXTRA = 1
const UINT32_MAX = 0xffffffff
const UINT16_MAX = 0xffff

export type ZipEntryMeta = {
  name: string
  compression: number
  compressedSize: number
  uncompressedSize: number
  localHeaderOffset: number
}

export class ZipDirectoryUnreadableError extends Error {
  constructor() {
    super(
      'Nie udało się odczytać spisu archiwum ZIP. Plik jest niekompletny albo uszkodzony. Wskaż pełne archiwum jeszcze raz. Pytania bez tego pliku dalej działają.',
    )
    this.name = 'ZipDirectoryUnreadableError'
  }
}

export class ZipEntryTruncatedError extends Error {
  constructor(name: string) {
    super(
      `Plik „${name}” jest ucięty w archiwum. To pytanie możesz rozwiązać bez obrazu — pozostałe pytania działają.`,
    )
    this.name = 'ZipEntryTruncatedError'
  }
}

const u16 = (bytes: Uint8Array, offset: number): number =>
  bytes[offset]! | (bytes[offset + 1]! << 8)

const u32 = (bytes: Uint8Array, offset: number): number =>
  (bytes[offset]! |
    (bytes[offset + 1]! << 8) |
    (bytes[offset + 2]! << 16) |
    (bytes[offset + 3]! << 24)) >>>
  0

const u64 = (bytes: Uint8Array, offset: number): number =>
  u32(bytes, offset) + u32(bytes, offset + 4) * 0x100000000

/** Byte index of the end-of-central-directory record inside `tail`, or -1. */
export function locateEndOfCentralDirectory(tail: Uint8Array): number {
  const min = Math.max(0, tail.length - (22 + 0xffff))
  for (let offset = tail.length - 22; offset >= min; offset -= 1) {
    if (u32(tail, offset) === SIG_EOCD) {
      return offset
    }
  }
  return -1
}

const applyZip64Extra = (
  entry: ZipEntryMeta,
  extra: Uint8Array,
): ZipEntryMeta => {
  let offset = 0
  while (offset + 4 <= extra.length) {
    const id = u16(extra, offset)
    const length = u16(extra, offset + 2)
    const start = offset + 4
    if (id === ZIP64_EXTRA) {
      let cursor = start
      let uncompressedSize = entry.uncompressedSize
      let compressedSize = entry.compressedSize
      let localHeaderOffset = entry.localHeaderOffset
      if (uncompressedSize === UINT32_MAX) {
        uncompressedSize = u64(extra, cursor)
        cursor += 8
      }
      if (compressedSize === UINT32_MAX) {
        compressedSize = u64(extra, cursor)
        cursor += 8
      }
      if (localHeaderOffset === UINT32_MAX) {
        localHeaderOffset = u64(extra, cursor)
      }
      return { ...entry, uncompressedSize, compressedSize, localHeaderOffset }
    }
    offset = start + length
  }
  return entry
}

/** Parses a central-directory buffer. Does not read local file bytes. */
export function parseCentralDirectory(directory: Uint8Array): ZipEntryMeta[] {
  const entries: ZipEntryMeta[] = []
  let offset = 0
  while (offset + 46 <= directory.length) {
    if (u32(directory, offset) !== SIG_CENTRAL) {
      break
    }
    const compression = u16(directory, offset + 10)
    const compressedSize = u32(directory, offset + 20)
    const uncompressedSize = u32(directory, offset + 24)
    const nameLength = u16(directory, offset + 28)
    const extraLength = u16(directory, offset + 30)
    const commentLength = u16(directory, offset + 32)
    const localHeaderOffset = u32(directory, offset + 42)
    const nameStart = offset + 46
    const nameEnd = nameStart + nameLength
    const extraEnd = nameEnd + extraLength
    if (extraEnd + commentLength > directory.length) {
      throw new ZipDirectoryUnreadableError()
    }
    const name = new TextDecoder().decode(directory.subarray(nameStart, nameEnd))
    let entry: ZipEntryMeta = {
      name,
      compression,
      compressedSize,
      uncompressedSize,
      localHeaderOffset,
    }
    if (
      compressedSize === UINT32_MAX ||
      uncompressedSize === UINT32_MAX ||
      localHeaderOffset === UINT32_MAX
    ) {
      entry = applyZip64Extra(entry, directory.subarray(nameEnd, extraEnd))
    }
    entries.push(entry)
    offset = extraEnd + commentLength
  }
  if (entries.length === 0) {
    throw new ZipDirectoryUnreadableError()
  }
  return entries
}

export type ZipEntryIndex = {
  byPath: Map<string, ZipEntryMeta>
  byBase: Map<string, ZipEntryMeta>
}

const normalizeName = (name: string): string => name.replace(/\\/g, '/').toLowerCase()

export function indexZipEntries(entries: readonly ZipEntryMeta[]): ZipEntryIndex {
  const byPath = new Map<string, ZipEntryMeta>()
  const byBase = new Map<string, ZipEntryMeta>()
  for (const entry of entries) {
    const path = normalizeName(entry.name)
    byPath.set(path, entry)
    const base = path.split('/').pop() ?? path
    if (!byBase.has(base)) {
      byBase.set(base, entry)
    }
  }
  return { byPath, byBase }
}

export function findZipEntry(index: ZipEntryIndex, filename: string): ZipEntryMeta | null {
  const path = normalizeName(filename)
  return index.byPath.get(path) ?? index.byBase.get(path.split('/').pop() ?? path) ?? null
}

const concatBytes = (chunks: Uint8Array[]): Uint8Array => {
  const total = chunks.reduce((sum, part) => sum + part.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const part of chunks) {
    out.set(part, offset)
    offset += part.length
  }
  return out
}

/** Reads one range. `Blob.slice` does not pull the rest of the archive. */
export async function readBlobRange(
  blob: Blob,
  start: number,
  end: number,
  onProgress?: (loaded: number, total: number) => void,
): Promise<Uint8Array> {
  if (start < 0 || end < start || end > blob.size) {
    throw new ZipEntryTruncatedError('archiwum')
  }
  const total = end - start
  const slice = blob.slice(start, end)
  if (typeof slice.stream !== 'function') {
    const bytes = new Uint8Array(await slice.arrayBuffer())
    onProgress?.(bytes.length, total)
    return bytes
  }
  const reader = slice.stream().getReader()
  const chunks: Uint8Array[] = []
  let loaded = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    if (value) {
      chunks.push(value)
      loaded += value.length
      onProgress?.(loaded, total)
    }
  }
  const bytes = concatBytes(chunks)
  if (bytes.length < total) {
    throw new ZipEntryTruncatedError('archiwum')
  }
  return bytes
}

type DirectoryLocation = {
  entryCount: number
  cdSize: number
  cdOffset: number
}

const directoryLocationFromTail = async (
  file: Blob,
  tail: Uint8Array,
): Promise<DirectoryLocation> => {
  const eocd = locateEndOfCentralDirectory(tail)
  if (eocd < 0) {
    throw new ZipDirectoryUnreadableError()
  }
  let entryCount: number = u16(tail, eocd + 10)
  let cdSize: number = u32(tail, eocd + 12)
  let cdOffset: number = u32(tail, eocd + 16)
  const needsZip64 =
    entryCount === UINT16_MAX || cdSize === UINT32_MAX || cdOffset === UINT32_MAX
  if (!needsZip64) {
    return { entryCount, cdSize, cdOffset }
  }
  const locator = eocd - 20
  if (locator < 0 || u32(tail, locator) !== SIG_LOCATOR64) {
    throw new ZipDirectoryUnreadableError()
  }
  const zip64Offset = u64(tail, locator + 8)
  const zip64 = await readBlobRange(file, zip64Offset, Math.min(file.size, zip64Offset + 80))
  if (zip64.length < 56 || u32(zip64, 0) !== SIG_EOCD64) {
    throw new ZipDirectoryUnreadableError()
  }
  entryCount = u64(zip64, 32)
  cdSize = u64(zip64, 40)
  cdOffset = u64(zip64, 48)
  return { entryCount, cdSize, cdOffset }
}

/** Reads only the central directory at the end of the zip, not each image. */
export async function loadZipIndex(
  file: Blob,
  onProgress?: (loaded: number, total: number) => void,
): Promise<ZipEntryMeta[]> {
  if (file.size < 22) {
    throw new ZipDirectoryUnreadableError()
  }
  const tailLength = Math.min(file.size, 128 * 1024)
  const tail = await readBlobRange(file, file.size - tailLength, file.size)
  const location = await directoryLocationFromTail(file, tail)
  if (location.cdOffset < 0 || location.cdOffset + location.cdSize > file.size) {
    throw new ZipDirectoryUnreadableError()
  }
  const directory = await readBlobRange(
    file,
    location.cdOffset,
    location.cdOffset + location.cdSize,
    onProgress,
  )
  const entries = parseCentralDirectory(directory)
  if (location.entryCount > 0 && entries.length < location.entryCount) {
    throw new ZipDirectoryUnreadableError()
  }
  return entries
}

const isDeflateEof = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error)
  return /unexpected eof/i.test(message)
}

/** Inflates a single catalogued entry. Other entries are not touched. */
export async function readZipEntry(
  file: Blob,
  entry: ZipEntryMeta,
  onProgress?: (loaded: number, total: number) => void,
): Promise<Uint8Array> {
  if (entry.localHeaderOffset + 30 > file.size) {
    throw new ZipEntryTruncatedError(entry.name)
  }
  const header = await readBlobRange(file, entry.localHeaderOffset, entry.localHeaderOffset + 30)
  if (header.length < 30 || u32(header, 0) !== SIG_LOCAL) {
    throw new ZipEntryTruncatedError(entry.name)
  }
  const nameLength = u16(header, 26)
  const extraLength = u16(header, 28)
  const dataStart = entry.localHeaderOffset + 30 + nameLength + extraLength
  const dataEnd = dataStart + entry.compressedSize
  if (dataEnd > file.size) {
    throw new ZipEntryTruncatedError(entry.name)
  }
  const compressed = await readBlobRange(file, dataStart, dataEnd, onProgress)
  if (entry.compression === 0) {
    return compressed
  }
  if (entry.compression !== 8) {
    throw new ZipEntryTruncatedError(entry.name)
  }
  try {
    return inflateSync(compressed)
  } catch (error) {
    if (isDeflateEof(error)) {
      throw new ZipEntryTruncatedError(entry.name)
    }
    throw error
  }
}
