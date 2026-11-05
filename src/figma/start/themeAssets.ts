import arrowRightDark from './assets/dark/arrow-right.svg'
import circleCheckDark from './assets/dark/circle-check.svg'
import imagePlusDark from './assets/dark/image-plus.svg'
import iosBatteryDark from './assets/dark/ios-battery.svg'
import iosSignalDark from './assets/dark/ios-signal.svg'
import iosWifiDark from './assets/dark/ios-wifi.svg'
import lockKeyholeSmDark from './assets/dark/lock-keyhole-sm.svg'
import lockKeyholeDark from './assets/dark/lock-keyhole.svg'
import moonDark from './assets/dark/moon.svg'
import rotateCcwDark from './assets/dark/rotate-ccw.svg'
import routeDark from './assets/dark/route.svg'
import smartphoneDark from './assets/dark/smartphone.svg'
import arrowRightLight from './assets/light/arrow-right.svg'
import circleCheckLight from './assets/light/circle-check.svg'
import imagePlusLight from './assets/light/image-plus.svg'
import iosBatteryLight from './assets/light/ios-battery.svg'
import iosSignalLight from './assets/light/ios-signal.svg'
import iosWifiLight from './assets/light/ios-wifi.svg'
import lockKeyholeSmLight from './assets/light/lock-keyhole-sm.svg'
import lockKeyholeLight from './assets/light/lock-keyhole.svg'
import rotateCcwLight from './assets/light/rotate-ccw.svg'
import routeLight from './assets/light/route.svg'
import smartphoneLight from './assets/light/smartphone.svg'
import sunLight from './assets/light/sun.svg'

export type StartTheme = 'light' | 'dark'

export interface StartThemeAssets {
  iosSignal: string
  iosWifi: string
  iosBattery: string
  route: string
  themeToggle: string
  circleCheck: string
  arrowRight: string
  lockKeyhole: string
  rotateCcw: string
  imagePlus: string
  lockKeyholeSm: string
  smartphone: string
}

const LIGHT_ASSETS: StartThemeAssets = {
  iosSignal: iosSignalLight,
  iosWifi: iosWifiLight,
  iosBattery: iosBatteryLight,
  route: routeLight,
  themeToggle: sunLight,
  circleCheck: circleCheckLight,
  arrowRight: arrowRightLight,
  lockKeyhole: lockKeyholeLight,
  rotateCcw: rotateCcwLight,
  imagePlus: imagePlusLight,
  lockKeyholeSm: lockKeyholeSmLight,
  smartphone: smartphoneLight,
}

const DARK_ASSETS: StartThemeAssets = {
  iosSignal: iosSignalDark,
  iosWifi: iosWifiDark,
  iosBattery: iosBatteryDark,
  route: routeDark,
  themeToggle: moonDark,
  circleCheck: circleCheckDark,
  arrowRight: arrowRightDark,
  lockKeyhole: lockKeyholeDark,
  rotateCcw: rotateCcwDark,
  imagePlus: imagePlusDark,
  lockKeyholeSm: lockKeyholeSmDark,
  smartphone: smartphoneDark,
}

export function getStartThemeAssets(theme: StartTheme): StartThemeAssets {
  return theme === 'dark' ? DARK_ASSETS : LIGHT_ASSETS
}
