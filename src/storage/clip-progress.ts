export type ClipLoadProgress =
  | { phase: 'queued' }
  | { phase: 'read'; loaded: number; total: number }
  | { phase: 'convert'; ratio: number }

export type ClipBatchStatus = {
  done: number
  failed: number
  total: number
}

/** Central-directory names that are WMV clips. The archive bytes are not read. */
export function isVideoZipName(name: string): boolean {
  const base = name.split('/').pop() ?? name
  return base.toLowerCase().endsWith('.wmv')
}

/** Moves preferred ids to the front. Ids that are not pending stay out. */
export function prioritizeIds(pending: readonly string[], preferred: readonly string[]): string[] {
  const pendingSet = new Set(pending)
  const front: string[] = []
  const seen = new Set<string>()
  for (const id of preferred) {
    if (!pendingSet.has(id) || seen.has(id)) {
      continue
    }
    seen.add(id)
    front.push(id)
  }
  return [...front, ...pending.filter((id) => !seen.has(id))]
}

/** Status line while one WMV clip is read from the zip and turned into MP4. */
export function clipProgressLabel(progress: ClipLoadProgress): string {
  if (progress.phase === 'queued') {
    return 'Ten klip czeka na konwersję w tle. Odtworzy się, gdy będzie gotowy.'
  }
  if (progress.phase === 'read') {
    const percent =
      progress.total > 0
        ? Math.min(100, Math.round((progress.loaded / progress.total) * 100))
        : 0
    return `Wczytywanie klipu z archiwum… ${percent}%`
  }
  const percent = Math.min(100, Math.max(0, Math.round(progress.ratio * 100)))
  return `Konwertuję ten klip… ${percent}%`
}

/** Quiet line for the whole zip. Hidden once every clip has been tried. */
export function clipBatchLabel(status: ClipBatchStatus): string | null {
  const finished = status.done + status.failed
  if (status.total === 0 || finished >= status.total) {
    return null
  }
  return `Konwersja klipów w tle: ${finished} z ${status.total}`
}
