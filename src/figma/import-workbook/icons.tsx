import arrowLeftUrl from './assets/arrow-left.svg'
import arrowRightPrimaryUrl from './assets/arrow-right-primary.svg'
import arrowRightUrl from './assets/arrow-right.svg'
import bookOpenCheckUrl from './assets/book-open-check.svg'
import checkCheckUrl from './assets/check-check.svg'
import downloadUrl from './assets/download.svg'
import folderOpenUrl from './assets/folder-open.svg'
import infoUrl from './assets/info.svg'
import iosBatteryUrl from './assets/ios-battery.svg'
import iosSignalUrl from './assets/ios-signal.svg'
import iosWifiUrl from './assets/ios-wifi.svg'
import moreHorizontalUrl from './assets/more-horizontal.svg'
import smartphoneUrl from './assets/smartphone.svg'

interface FigmaIconImageProps {
  src: string
  width: number
  height: number
  className?: string
}

function FigmaIconImage({ src, width, height, className }: FigmaIconImageProps) {
  return (
    <img
      src={src}
      alt=""
      width={width}
      height={height}
      className={className}
      aria-hidden
      draggable={false}
    />
  )
}

export function IconArrowLeft() {
  return <FigmaIconImage src={arrowLeftUrl} width={18} height={18} />
}

export function IconMoreHorizontal() {
  return <FigmaIconImage src={moreHorizontalUrl} width={20} height={20} />
}

export function IconDownload() {
  return <FigmaIconImage src={downloadUrl} width={20} height={20} />
}

export function IconFolderOpen() {
  return <FigmaIconImage src={folderOpenUrl} width={20} height={20} />
}

export function IconArrowRight() {
  return <FigmaIconImage src={arrowRightUrl} width={18} height={18} />
}

export function IconArrowRightPrimary() {
  return <FigmaIconImage src={arrowRightPrimaryUrl} width={18} height={18} />
}

export function IconInfo() {
  return <FigmaIconImage src={infoUrl} width={18} height={18} />
}

export function IconSmartphone() {
  return <FigmaIconImage src={smartphoneUrl} width={14} height={14} />
}

export function IconCheckDouble() {
  return <FigmaIconImage src={checkCheckUrl} width={30} height={30} />
}

export function IconBookOpenCheck() {
  return <FigmaIconImage src={bookOpenCheckUrl} width={18} height={18} />
}

export function IconSignal() {
  return <FigmaIconImage src={iosSignalUrl} width={18} height={18} />
}

export function IconWifi() {
  return <FigmaIconImage src={iosWifiUrl} width={18} height={18} />
}

export function IconBattery() {
  return <FigmaIconImage src={iosBatteryUrl} width={25} height={18} />
}
