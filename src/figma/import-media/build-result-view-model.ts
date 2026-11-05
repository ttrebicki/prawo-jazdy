import {
  FIGMA_RESULT_CLIPS_STORED,
  FIGMA_RESULT_FOOTNOTE_LINE,
  FIGMA_RESULT_IMAGES_FOUND,
  FIGMA_RESULT_QUESTIONS_B_WITHOUT_MEDIA,
} from './figma-display-copy.ts'
import type { MediaImportResultViewModel } from './types.ts'

/** Result screen uses Figma sample figures; clips are not derived from `wmvGaps`. */
export function buildMediaImportResultViewModel(): MediaImportResultViewModel {
  return {
    imagesFound: FIGMA_RESULT_IMAGES_FOUND,
    clipsStored: FIGMA_RESULT_CLIPS_STORED,
    questionsBWithoutMedia: FIGMA_RESULT_QUESTIONS_B_WITHOUT_MEDIA,
    catalogDateLabel: FIGMA_RESULT_FOOTNOTE_LINE,
  }
}
