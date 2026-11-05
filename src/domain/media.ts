import type { Question, ResolvedMedia } from './types.ts'

export function resolveQuestionMedia(
  question: Question,
  hasFileOnDevice: (filename: string) => boolean,
): ResolvedMedia {
  if (question.mediaKind === 'none' || !question.mediaFilename) {
    return {
      kind: 'none',
      reason: 'none_needed',
      blob: null,
      filename: null,
    }
  }

  if (question.mediaKind === 'video') {
    return {
      kind: 'video',
      reason: 'video_wmv',
      blob: null,
      filename: question.mediaFilename,
    }
  }

  if (hasFileOnDevice(question.mediaFilename)) {
    return {
      kind: 'image',
      reason: 'available',
      blob: null,
      filename: question.mediaFilename,
    }
  }

  return {
    kind: 'image',
    reason: 'missing_file',
    blob: null,
    filename: question.mediaFilename,
  }
}

export function isMediaViewableForMastery(
  question: Question,
  resolved: ResolvedMedia,
): boolean {
  if (question.mediaKind === 'none') {
    return true
  }
  return resolved.reason === 'available'
}
