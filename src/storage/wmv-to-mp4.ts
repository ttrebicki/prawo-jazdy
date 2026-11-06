import { FFmpeg } from '@ffmpeg/ffmpeg'
import coreURL from '@ffmpeg/core?url'
import wasmURL from '@ffmpeg/core/wasm?url'

let loading: Promise<FFmpeg> | null = null
let queue: Promise<void> = Promise.resolve()

const loadFfmpeg = (): Promise<FFmpeg> => {
  if (!loading) {
    loading = (async () => {
      const ffmpeg = new FFmpeg()
      // Core stays with the app. The question clip is never uploaded.
      await ffmpeg.load({ coreURL, wasmURL })
      return ffmpeg
    })().catch((error: unknown) => {
      loading = null
      throw error
    })
  }
  return loading
}

const toBytes = (data: Uint8Array | string): Uint8Array => {
  if (typeof data === 'string' || data.length === 0) {
    throw new Error('Pusta konwersja MP4')
  }
  return data
}

const convertNow = async (
  wmv: Uint8Array,
  onProgress: (ratio: number) => void,
): Promise<Blob> => {
  const ffmpeg = await loadFfmpeg()
  const onRatio = ({ progress }: { progress: number }) => {
    if (Number.isFinite(progress)) {
      onProgress(Math.max(0, Math.min(1, progress)))
    }
  }
  ffmpeg.on('progress', onRatio)
  try {
    await ffmpeg.writeFile('in.wmv', wmv)
    let code = await ffmpeg.exec([
      '-i',
      'in.wmv',
      '-c:v',
      'libx264',
      '-preset',
      'ultrafast',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '96k',
      '-movflags',
      '+faststart',
      'out.mp4',
    ])
    if (code !== 0) {
      code = await ffmpeg.exec([
        '-i',
        'in.wmv',
        '-c:v',
        'libx264',
        '-preset',
        'ultrafast',
        '-pix_fmt',
        'yuv420p',
        '-an',
        '-movflags',
        '+faststart',
        'out.mp4',
      ])
    }
    if (code !== 0) {
      throw new Error('Konwersja WMV nie powiodła się')
    }
    const mp4 = toBytes(await ffmpeg.readFile('out.mp4'))
    return new Blob([mp4.slice()], { type: 'video/mp4' })
  } finally {
    ffmpeg.off('progress', onRatio)
    await ffmpeg.deleteFile('in.wmv').catch(() => undefined)
    await ffmpeg.deleteFile('out.mp4').catch(() => undefined)
  }
}

/** Converts one clip. Later calls wait so a single ffmpeg instance is not re-entered. */
export function convertWmvToMp4(
  wmv: Uint8Array,
  onProgress: (ratio: number) => void,
): Promise<Blob> {
  const job = queue.then(() => convertNow(wmv, onProgress))
  queue = job.then(
    () => undefined,
    () => undefined,
  )
  return job
}
