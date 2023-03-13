import Joi from 'joi';
import * as ChartService from '../services/chart.service.js';

/**
 * @async
 * @function renderChart
 * @description Controller for rendering chart
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export async function renderChart(req, res, next) {
    try {
        const schema = Joi.object({
            c: Joi.string().required(),
            w: Joi.number().integer().min(150).max(2000).optional(),
            h: Joi.number().integer().min(150).max(2000).optional(),
            f: Joi.string().valid('png', 'svg').optional(),
        });
        await schema.validateAsync(req.query);
        const { data, format } = await ChartService.renderChart(req.query);
        res.set('Content-Type', format[1]);
        res.send(data);
    } catch (error) {
        next(error);
    }
}
