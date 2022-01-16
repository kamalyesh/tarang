import { SvgHandler } from "../../SvgHandler";
import { idman } from '../../utils/idman';

export class LineSvgHandler extends SvgHandler {
    constructor(canvasId, dimensions, scale = 1) {
        super(canvasId, dimensions, scale)
    }
    init(background) {
        const { canvasId, customScale, dimensions, d3 } = this
        this.graph = d3.select('#' + canvasId)
            .append('svg')
            .attr('height', dimensions.HEIGHT)
            .attr('width', dimensions.WIDTH)
            .attr('class', 'my-1')
            .attr('style', `${background}`)
            .attr('id', "line_" + canvasId + "_" + idman.next());
    }
    update(frequencies, opacity) {
        const { dimensions, d3, graph, scale } = this
        this.clear()
        var lineFunc = d3.line()
            .x(function (d, i) {
                // return i * dimensions.WIDTH / frequencies.length;
                return i * dimensions.WIDTH * scale.WIDTH / frequencies.length;
            })
            .y(function (d) {
                return dimensions.HEIGHT - (d * scale.HEIGHT);
            })
        graph.append('path')
            .attr('d', lineFunc(frequencies))
            .attr('stroke', 'black')
            // .attr('fill-opacity', opacity)
            .attr('fill', 'none')
    }
}