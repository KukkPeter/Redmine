import { Response, Request, NextFunction } from 'express';
import { ValidateError } from 'tsoa';
import { JsonWebTokenError } from 'jsonwebtoken';
import { IResponse } from '../interfaces/IResponse.interface';

export function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): Response<IResponse> | void {
    if (error instanceof JsonWebTokenError) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized",
            data: error.message,
        });
    }

    if (error instanceof ValidateError) {
        return res.status(422).json({
            status: 422,
            message: "Validation Failed",
            data: error.fields.toString().split(': ')[1]
        });
    }

    if (error instanceof Error) {
        return res.status(400).json({
            status: 400,
            message: "Error",
            data: error.message,
        });
    }

    next();
}