import type { AppView } from '../../ui/navigation.ts'
import {
  VIEW_HOME,
  VIEW_IMPORT_MEDIA,
  VIEW_IMPORT_WORKBOOK,
  VIEW_MISTAKES,
  VIEW_MOCK,
  VIEW_PRACTICE,
} from '../../ui/navigation.ts'

export type WideNavKey =
  | 'start'
  | 'practice'
  | 'mistakes'
  | 'mock'
  | 'catalog'

export interface WideNavItem {
  key: WideNavKey
  label: string
  view: AppView
  locked?: boolean
}

export const WIDE_NAV_ITEMS: WideNavItem[] = [
  { key: 'start', label: 'Start', view: VIEW_HOME },
  { key: 'practice', label: 'Ćwiczenia', view: VIEW_PRACTICE },
  { key: 'mistakes', label: 'Błędy', view: VIEW_MISTAKES },
  { key: 'mock', label: 'Egzamin próbny', view: VIEW_MOCK, locked: true },
  { key: 'catalog', label: 'Katalog', view: VIEW_IMPORT_WORKBOOK },
]

export function wideNavActiveKey(view: AppView): WideNavKey {
  switch (view) {
    case VIEW_HOME:
      return 'start'
    case VIEW_PRACTICE:
      return 'practice'
    case VIEW_MISTAKES:
      return 'mistakes'
    case VIEW_MOCK:
      return 'mock'
    case VIEW_IMPORT_WORKBOOK:
    case VIEW_IMPORT_MEDIA:
      return 'catalog'
    default:
      return 'start'
  }
}
