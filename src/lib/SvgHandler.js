import * as d3 from 'd3'
import { idman } from './utils/idman';
import Constants from './Constants';
import binaryFloor from './utils/binaryFloor';

export class SvgHandler {
    constructor(canvasId, dimensions = { ...Constants.DEFAULT_DIMENSIONS }, scale = 1) {
        if (canvasId) this.canvasId = canvasId
        else this.canvasId = idman.next()
        this.customScale = scale
        this.scale = { ...Constants.DEFAULT_DIMENSIONS_SCALE }
        if (dimensions) {
            this.dimensions = dimensions
            this.updateSvgWidthScale()
            this.updateSvgHeightScale()
        }
        this.graph = null;
        if (!d3) throw new Error("d3 is not found. Tarang may not behave as expected.")
        else this.d3 = d3
    }
    init() {
    }
    update() {
    }
    clear() {
        if (this.graph) {
            this.graph.selectAll("*").remove()
        }
    }
    updateSvgHeightScale() {
        let assumedHeight = parseInt(this.dimensions.WIDTH * 0.5)
        if (this.dimensions.HEIGHT - assumedHeight) this.scale.HEIGHT = Math.abs(this.dimensions.HEIGHT - assumedHeight) / assumedHeight * this.customScale
        else this.scale.HEIGHT = this.customScale
        // console.log({ scale: this.scale })
    }
    updateSvgWidthScale() {
        let assumedWidth = binaryFloor(this.dimensions.WIDTH * 0.5)
        if (this.dimensions.WIDTH - assumedWidth) this.scale.WIDTH = Math.abs(this.dimensions.WIDTH - assumedWidth) / assumedWidth * this.customScale
        else this.scale.WIDTH = this.customScale
        // console.log({ scale: this.scale })
    }
    destroy() {
        this.clear()
        this.graph.remove();
        this.graph = null;
    }
}