import { NextFunction, Request, Response } from "express";
import logger from "../logger/winston";

export const loggingMiddleware = (context?: Record<string, any>) => {
  return function (req: Request, res: Response, next: NextFunction) {
    const { method, path, query, params } = req;

    const originalSend = res.send;

    res.send = function (body) {
      const { statusCode } = res;
      let responseBody = body;

      if (typeof body === "string") {
        try {
          responseBody = JSON.parse(body);
        } catch {}
      }

      logger.info(
        JSON.stringify(
          {
            method,
            path,
            requestBody: {
              ...req.body,
              password: req.body.password ? "****" : undefined,
            },
            query,
            params,
            statusCode,
            responseBody,
            context,
          },
          null,
          2
        )
      );

      return originalSend.call(this, body);
    };

    next();
  };
};
