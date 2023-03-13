import Joi from 'joi';

export function defaultErrorHandler(err, req, res, next) {
    let ERROR_CODE = 500;
    // print error and stack trace
    console.log('-'.repeat(80));
    console.error("Message: ", err.message);
    console.error("Status: ", err.status);
    console.error("Actual Error: ", err.actualError);
    console.error("Stack: ", err.stack);
    console.log('-'.repeat(80));
    if (err?.status) {
        ERROR_CODE = err.status;
    }
    if (err instanceof Joi.ValidationError) {
        ERROR_CODE = 400;
        return res.status(ERROR_CODE).json({ message: err.message });
    }
    if (err instanceof ApiError) {
        return res.status(ERROR_CODE).json({ message: err.message });
    }
    return res.status(ERROR_CODE).json({ message: 'Unexpected error' });
}

export class ApiError extends Error {
    constructor(message, status, actualError, stack) {
        super(message);
        this.status = status;
        this.actualError = actualError;
        this.stack = stack;
    }
}
