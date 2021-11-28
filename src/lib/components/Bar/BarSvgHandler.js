import { SvgHandler } from "../../SvgHandler";
import idman from 'idman';
const { getNextId } = idman;

export class BarSvgHandler extends SvgHandler {
    constructor(canvasId, dimensions, scale = 1) {
        super(canvasId, dimensions, scale)
        this.BAR_PADDING = 1
    }
    init(style) {
        const { canvasId, customScale, dimensions, d3 } = this
        this.graph = d3.select('#' + canvasId)
            .append('svg')
            .attr('height', dimensions.HEIGHT)
            .attr('width', dimensions.WIDTH)
            .attr('class', 'my-1')
            .attr('style', style)
            .attr('id', "bar_" + canvasId + "_" + getNextId());
    }
    update(frequencies, opacity = 1) {
        const { BAR_PADDING, dimensions, graph, scale } = this
        graph.selectAll('rect')
            .data(frequencies)
            .enter()
            .append('rect')
            // .attr('fill-opacity', function (d) {
            //     return opacity
            // })
            .attr('fill', function (d) {
                return "#000"
            })
            .attr('width', dimensions.WIDTH / frequencies.length - BAR_PADDING)
            .attr('x', function (d, i) {
                return i * ((dimensions.WIDTH * scale.WIDTH) / frequencies.length);
                // return i * (dimensions.WIDTH / frequencies.length);
            })
        graph.selectAll('rect')
            .data(frequencies)
            .attr('y', function (d, i) {
                return dimensions.HEIGHT - (d * scale.HEIGHT)
            })
            .attr('height', function (d, i) {
                return (d * scale.HEIGHT)
            });
    }
}
