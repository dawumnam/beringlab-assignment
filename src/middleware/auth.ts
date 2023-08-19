import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// should not use in production :O
const SECRET_KEY = "secret";

export const authMiddleware = () => {
  return function (req: Request, res: Response, next: NextFunction) {
    if (process.env["NODE_ENV"] !== "production") {
      return next();
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Missing token." });
    }

    jwt.verify(token, SECRET_KEY, (err) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token." });
      }
      return;
    });
    return next();
  };
};
