import { Request, Response, NextFunction } from "express";
import { promisify } from "util";
require("dotenv-safe").config();
var jwt = require("jsonwebtoken");

export default async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).json({ error: "Token not provided" });
  }
  const [, token] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET);

    request.body.id = decoded.id;

    return next();
  } catch (err) {
    return response.status(401).json({ error: "Token invalid" });
  }
};
