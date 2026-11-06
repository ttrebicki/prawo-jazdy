import { strFromU8, strToU8, zipSync } from 'fflate'
import { describe, expect, it } from 'vitest'
import {
  ZipEntryTruncatedError,
  findZipEntry,
  indexZipEntries,
  loadZipIndex,
  readZipEntry,
} from '../src/storage/zip-directory.ts'

describe('loadZipIndex and readZipEntry', () => {
  const archive = zipSync({
    'folder/a.jpg': strToU8('alpha-image'),
    'b.jpg': strToU8('beta-image-is-longer'),
  })
  const file = new Blob([archive])

  it('reads one entry without needing the other file bytes', async () => {
    const entries = await loadZipIndex(file)
    const index = indexZipEntries(entries)
    const alpha = findZipEntry(index, 'a.jpg')
    const beta = findZipEntry(index, 'b.jpg')
    expect(alpha).not.toBeNull()
    expect(beta).not.toBeNull()

    const alphaBytes = await readZipEntry(file, alpha!)
    expect(strFromU8(alphaBytes)).toBe('alpha-image')

    const cut = file.slice(0, beta!.localHeaderOffset)
    await expect(readZipEntry(cut, beta!)).rejects.toBeInstanceOf(ZipEntryTruncatedError)
    const alphaStill = await readZipEntry(cut, alpha!)
    expect(strFromU8(alphaStill)).toBe('alpha-image')
  })

  it('reports a missing name instead of a blob', async () => {
    const entries = await loadZipIndex(file)
    expect(findZipEntry(indexZipEntries(entries), 'brak.jpg')).toBeNull()
  })
})
