import { resolveQuestionMedia } from './media.ts'
import type {
  Question,
  QuestionBank,
  QuestionCatalogMeta,
  QuestionListFilter,
} from './types.ts'

export class InMemoryQuestionBank implements QuestionBank {
  private questions: Question[] = []
  private meta: QuestionCatalogMeta = {
    catalogFilename: '',
    catalogModifiedAt: null,
  }

  setCatalog(questions: Question[], meta: QuestionCatalogMeta): void {
    this.questions = questions
    this.meta = meta
  }

  getCatalogMeta(): QuestionCatalogMeta {
    return this.meta
  }

  listQuestions(filter: QuestionListFilter): Question[] {
    return this.questions.filter((question) => {
      if (!question.categories.includes(filter.category)) {
        return false
      }
      if (filter.scope !== undefined && question.scope !== filter.scope) {
        return false
      }
      if (filter.points !== undefined && question.points !== filter.points) {
        return false
      }
      return true
    })
  }

  getByOfficialNumber(officialNumber: string): Question | undefined {
    return this.questions.find((q) => q.officialNumber === officialNumber)
  }

  resolveMedia(
    question: Question,
    hasFileOnDevice: (filename: string) => boolean,
  ) {
    return resolveQuestionMedia(question, hasFileOnDevice)
  }
}
