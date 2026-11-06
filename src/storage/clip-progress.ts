export type ClipLoadProgress =
  | { phase: 'read'; loaded: number; total: number }
  | { phase: 'convert'; ratio: number }

/** Status line while one WMV clip is read from the zip and turned into MP4. */
export function clipProgressLabel(progress: ClipLoadProgress): string {
  if (progress.phase === 'read') {
    const percent =
      progress.total > 0
        ? Math.min(100, Math.round((progress.loaded / progress.total) * 100))
        : 0
    return `Wczytywanie klipu z archiwum… ${percent}%`
  }
  const percent = Math.min(100, Math.max(0, Math.round(progress.ratio * 100)))
  return `Konwertuję klip do MP4… ${percent}%`
}
