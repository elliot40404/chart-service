import Chart from 'chart.js/auto';
import { ApiError } from '../middleware/errorHandler.js';

export const FORMATS = Object.freeze({
    png: ['png', 'image/png'],
    svg: ['svg', 'image/svg+xml'],
});

export const RE_H = /([A-Z]+):/gi;
export const RE_V = /'(\w.*?)'/gi;
export const RE_C = /(,)(?=\s*?[}\]])/gi;
export const DEF_HEIGHT = 300;
export const DEF_WIDTH = 300;
export const DEF_FORMAT = FORMATS.png;

export function strToObj(str) {
    try {
        if (typeof str !== 'string') return null;
        let obj = str
            .replace(RE_H, '"$1":')
            ?.replace(RE_V, '"$1"')
            ?.replace(RE_C, '');
        return JSON.parse(obj);
    } catch (error) {
        throw new ApiError(
            'Invalid chart config',
            400,
            error.message,
            error.stack
        );
    }
}

export function chartRenderer(ctx, config) {
    return new Promise(async (resolve, reject) => {
        try {
            new Chart(ctx, config);
            resolve();
        } catch (error) {
            throw new ApiError(
                'Invalid chart config',
                400,
                error.message,
                error.stack
            );
        }
    });
}

export function formatQuery(query) {
    const { c: chartConfig, w: inpWidth, h: inpHeight, f: inpFormat } = query;
    const width = Number(inpWidth) || DEF_WIDTH;
    const height = Number(inpHeight) || DEF_HEIGHT;
    const format = FORMATS[inpFormat] || DEF_FORMAT;
    const config = strToObj(chartConfig);
    return { width, height, config, format };
}
