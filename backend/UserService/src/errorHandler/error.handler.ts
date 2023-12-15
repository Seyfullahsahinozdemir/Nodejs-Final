import { Request, Response, NextFunction } from "express";
export const logError = (
  err: TypeError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  res.status(500);
};
