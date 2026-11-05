import { figmaAssetUrls, type FigmaAssetName } from './figma-assets.ts'

type FigmaIconProps = {
  name: FigmaAssetName
  width: number
  height: number
  className?: string
}

export function FigmaIcon({ name, width, height, className }: FigmaIconProps) {
  return (
    <img
      className={className ?? 'figma-import-media__asset'}
      src={figmaAssetUrls[name]}
      width={width}
      height={height}
      alt=""
      aria-hidden
      draggable={false}
    />
  )
}

export function IconArrowLeft() {
  return <FigmaIcon name="arrowLeft" width={18} height={18} />
}

export function IconMoreHorizontal() {
  return <FigmaIcon name="moreHorizontal" width={20} height={20} />
}

export function IconStatusSignal() {
  return <FigmaIcon name="iosSignal" width={18} height={18} />
}

export function IconStatusWifi() {
  return <FigmaIcon name="iosWifiSignal" width={18} height={18} />
}

export function IconStatusBattery() {
  return <FigmaIcon name="iosBatteryFull" width={25} height={18} />
}

export function IconImage() {
  return <FigmaIcon name="image" width={24} height={24} />
}

export function IconClapperboard() {
  return <FigmaIcon name="clapperboard" width={24} height={24} />
}

export function IconArchive() {
  return <FigmaIcon name="archive" width={24} height={24} />
}

export function IconWifi() {
  return <FigmaIcon name="wifi" width={18} height={18} />
}

export function IconDownload() {
  return <FigmaIcon name="download" width={18} height={18} />
}

export function IconSmartphone() {
  return <FigmaIcon name="smartphone" width={14} height={14} />
}

export function IconFolderCheck() {
  return <FigmaIcon name="folderCheck" width={30} height={30} />
}

export function IconInfo() {
  return <FigmaIcon name="info" width={18} height={18} />
}

export function IconArrowRight() {
  return <FigmaIcon name="arrowRight" width={18} height={18} />
}
