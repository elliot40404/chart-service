import express from 'express';
import * as ChartController from '../controllers/chart.controller.js';

const api = express.Router();

api.get('/', ChartController.renderChart);

export default api;
