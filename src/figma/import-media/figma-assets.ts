import arrowLeftUrl from './assets/arrow-left.svg?url'
import arrowRightUrl from './assets/arrow-right.svg?url'
import archiveUrl from './assets/archive.svg?url'
import clapperboardUrl from './assets/clapperboard.svg?url'
import downloadUrl from './assets/download.svg?url'
import folderCheckUrl from './assets/folder-check.svg?url'
import imageUrl from './assets/image.svg?url'
import infoUrl from './assets/info.svg?url'
import iosBatteryFullUrl from './assets/ios-battery-full.svg?url'
import iosSignalUrl from './assets/ios-signal.svg?url'
import iosWifiSignalUrl from './assets/ios-wifi-signal.svg?url'
import moreHorizontalUrl from './assets/more-horizontal.svg?url'
import smartphoneUrl from './assets/smartphone.svg?url'
import wifiUrl from './assets/wifi.svg?url'

export const figmaAssetUrls = {
  arrowLeft: arrowLeftUrl,
  arrowRight: arrowRightUrl,
  archive: archiveUrl,
  clapperboard: clapperboardUrl,
  download: downloadUrl,
  folderCheck: folderCheckUrl,
  image: imageUrl,
  info: infoUrl,
  iosBatteryFull: iosBatteryFullUrl,
  iosSignal: iosSignalUrl,
  iosWifiSignal: iosWifiSignalUrl,
  moreHorizontal: moreHorizontalUrl,
  smartphone: smartphoneUrl,
  wifi: wifiUrl,
} as const

export type FigmaAssetName = keyof typeof figmaAssetUrls
