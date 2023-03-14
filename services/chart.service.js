import { createCanvas,registerFont } from 'canvas';
import * as ChartHelper from '../helpers/chart.js';

registerFont('fonts/Montserrat.ttf', { family: 'Montserrat' });

/**
 * @async
 * @function renderChart
 * @description Controller for rendering chart
 * @param {object} chartConfig
 * @param {number} chartConfig.width
 * @param {number} chartConfig.height
 * @param {string} chartConfig.format
 * @param {object} chartConfig.config
 * @returns {Promise<{data: Buffer, format: string[]}>}
 */
export async function renderChart(chartConfig) {
    const { width, height, config, format } =
        ChartHelper.formatQuery(chartConfig);
    const canvas = createCanvas(width, height, format[0]);
    await ChartHelper.chartRenderer(canvas, config);
    return {
        data: canvas.toBuffer(format[1]),
        format,
    };
}
