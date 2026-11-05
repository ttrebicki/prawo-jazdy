import type { FigmaPracticeTheme } from './theme.ts'

import arrowLeftDark from './assets/dark/arrow-left.svg'
import chevronUpDark from './assets/dark/chevron-up.svg'
import circleCheckDark from './assets/dark/circle-check.svg'
import circleHelpDark from './assets/dark/circle-help.svg'
import circleXDark from './assets/dark/circle-x.svg'
import imageDark from './assets/dark/image.svg'
import iosBatteryDark from './assets/dark/ios-battery.svg'
import iosSignalDark from './assets/dark/ios-signal.svg'
import iosWifiDark from './assets/dark/ios-wifi.svg'
import moreHorizontalDark from './assets/dark/more-horizontal.svg'
import arrowLeftLight from './assets/light/arrow-left.svg'
import arrowRightLight from './assets/light/arrow-right.svg'
import chevronDownLight from './assets/light/chevron-down.svg'
import chevronUpLight from './assets/light/chevron-up.svg'
import circleCheckLight from './assets/light/circle-check.svg'
import circleDotLight from './assets/light/circle-dot.svg'
import circleHelpLight from './assets/light/circle-help.svg'
import circleLight from './assets/light/circle.svg'
import circleXLight from './assets/light/circle-x.svg'
import imageLight from './assets/light/image.svg'
import iosBatteryLight from './assets/light/ios-battery.svg'
import iosSignalLight from './assets/light/ios-signal.svg'
import iosWifiLight from './assets/light/ios-wifi.svg'
import moreHorizontalLight from './assets/light/more-horizontal.svg'
import textLight from './assets/light/text.svg'

export interface FigmaPracticeAssets {
  iosSignal: string
  iosWifi: string
  iosBattery: string
  arrowLeft: string
  moreHorizontal: string
  image: string
  circle: string
  circleDot: string
  circleHelp: string
  chevronUp: string
  chevronDown: string
  circleX: string
  circleCheck: string
  arrowRight: string
  text: string
}

const LIGHT_ASSETS: FigmaPracticeAssets = {
  iosSignal: iosSignalLight,
  iosWifi: iosWifiLight,
  iosBattery: iosBatteryLight,
  arrowLeft: arrowLeftLight,
  moreHorizontal: moreHorizontalLight,
  image: imageLight,
  circle: circleLight,
  circleDot: circleDotLight,
  circleHelp: circleHelpLight,
  chevronUp: chevronUpLight,
  chevronDown: chevronDownLight,
  circleX: circleXLight,
  circleCheck: circleCheckLight,
  arrowRight: arrowRightLight,
  text: textLight,
}

const DARK_ASSETS: FigmaPracticeAssets = {
  iosSignal: iosSignalDark,
  iosWifi: iosWifiDark,
  iosBattery: iosBatteryDark,
  arrowLeft: arrowLeftDark,
  moreHorizontal: moreHorizontalDark,
  image: imageDark,
  circle: circleLight,
  circleDot: circleDotLight,
  circleHelp: circleHelpDark,
  chevronUp: chevronUpDark,
  chevronDown: chevronDownLight,
  circleX: circleXDark,
  circleCheck: circleCheckDark,
  arrowRight: arrowRightLight,
  text: textLight,
}

export function figmaPracticeAssets(theme: FigmaPracticeTheme): FigmaPracticeAssets {
  return theme === 'dark' ? DARK_ASSETS : LIGHT_ASSETS
}
