'use strict';
// -- IMPORTS --
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { defaultErrorHandler } from './middleware/errorHandler.js';
import chartRoutes from './routes/chart.routes.js';

// -- CONFIG --
// file deepcode ignore UseCsurfForExpress: <Defeats purpose of rest api>
const app = express();
app.set('trust proxy', true);
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.enable('trust proxy');
app.use(
    morgan(
        ':remote-addr :remote-user :date[clf] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms :total-time ms'
    )
);
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false, // cors
        dnsPrefetchControl: false,
        frameguard: false,
        expectCt: false,
        hsts: false,
        ieNoOpen: false,
        noSniff: false,
        originAgentCluster: false,
        permittedCrossDomainPolicies: false,
        referrerPolicy: 'strict-origin-when-cross-origin',
        xssFilter: false,
    })
);
app.set('etag', false);
app.use(
    cors({
        origin: '*',
        preflightContinue: true,
    })
);
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.use('/chart', chartRoutes);

app.use(defaultErrorHandler);

app.use('*', (_req, res) => {
    res.status(404).json({ message: 'Not found' });
});

const PORT = process.env.API_PORT || 3000;
const URI = process.env.API_URL || 'http://localhost:3000';
const server = app.listen(PORT, () => {
    console.log(`Server started w/ pid ${process.pid}`);
    console.log(`Listening on ${URI}`);
});
