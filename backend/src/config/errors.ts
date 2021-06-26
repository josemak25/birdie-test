import env from "./env";
import httpStatus from "http-status";
import { isCelebrateError } from "celebrate";
import { NODE_ENV } from "typings/global_enums";
import { Request, Response, NextFunction } from "express";
import { APIError, joiErrorFormatter, reportError } from "../helpers";

/**
 *
 * @description custom error handler for returning each custom api error to the appropriate resource
 * @function handler
 * @property (parameter) error: ExpressErrorInterface
 * @property (parameter) req: express.Request
 * @property (parameter) res: express.Response
 * @property (parameter) next: express.NextFunction
 * @returns {void}
 */
export const handler = (
  error: ExpressErrorInterface,
  _req: Request,
  res: Response,
  _next?: NextFunction
): void => {
  const response: ErrorResponseInterface = {
    payload: null,
    stack: error.stack,
    errors: error.errors,
    statusCode: error.status,
    message: error.message || String(httpStatus[error.status]),
  };

  if (env.NODE_ENV !== NODE_ENV.DEVELOPMENT) {
    delete response.stack;
  }

  reportError(error);
  res.status(error.status).json(response);
};

/**
 *
 * @description Custom error converter
 * @function converter
 * @property (parameter) error: ExpressErrorInterface
 * @property (parameter) req: express.Request
 * @property (parameter) res: express.Response
 * @property (parameter) next: express.NextFunction
 * @returns {void}
 */
export const converter = (
  error: ExpressErrorInterface,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let convertedError: Error = error;

  if (isCelebrateError(error)) {
    convertedError = new APIError({
      payload: {},
      message: "Invalid fields",
      status: httpStatus.BAD_REQUEST,
      errors: joiErrorFormatter(error.details as any) || {},
    });
  }

  if (!(convertedError instanceof APIError)) {
    convertedError = new APIError({
      message: error.message,
      status: error.status,
      stack: error.stack,
      errors: null,
    });
  }

  return handler(convertedError as ExpressErrorInterface, req, res, next);
};

/**
 *
 * @description Catch all 404 {NOT_FOUND} errors by passing each error to the custom api error constructor method
 * @function notFound
 * @property (parameter) req: express.Request
 * @property (parameter) res: express.Response
 * @property (parameter) next: express.NextFunction
 * @returns void
 */
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new APIError({
    message: "Not found",
    status: httpStatus.NOT_FOUND,
    stack: undefined,
    errors: null,
  });

  return handler(error as unknown as ExpressErrorInterface, req, res, next);
};
