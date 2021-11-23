import binaryCeil from "./lib/utils/binaryCeil"
import binaryFloor from "./lib/utils/binaryFloor"
import constants from "./lib/Constants"
import { SvgHandler } from "./lib/SvgHandler"
import Bar from "./lib/components/Bar"
import Line from "./lib/components/Line"

export const Tarang = {
  Bar,
  Line,
  utils: {
    binaryCeil,
    binaryFloor
  },
  SvgHandler,
  ...constants
}
