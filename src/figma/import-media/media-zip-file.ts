import { OFFICIAL_MEDIA_ZIP_URL } from '../../domain/constants.ts'

export function isMediaZipFile(file: File): boolean {
  const lowerName = file.name.toLowerCase()
  if (lowerName.endsWith('.zip')) {
    return true
  }
  return (
    file.type === 'application/zip' ||
    file.type === 'application/x-zip-compressed'
  )
}

export function mediaZipValidationError(fileName: string): string {
  return `Plik „${fileName}” nie wygląda na archiwum ZIP multimediów. Pobierz oficjalne archiwum z gov.pl (${OFFICIAL_MEDIA_ZIP_URL}) i wskaż ten plik .zip.`
}

export { OFFICIAL_MEDIA_ZIP_URL }
