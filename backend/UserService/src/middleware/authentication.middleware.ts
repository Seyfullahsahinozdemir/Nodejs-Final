import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt.utils";
import CustomResponse from "../utils/custom.response";

export const authenticateForAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let jwtToken = req.headers["authorization"] as string;

  if (!jwtToken) {
    return new CustomResponse(null, "Unauthorized").error401(res);
  }

  const verifyTokenResult = verifyToken(jwtToken, res);

  if (!verifyTokenResult) {
    return new CustomResponse(null, "Jwt Expired").error500(res);
  }

  if (verifyTokenResult.isAdmin) {
    req.user = {
      id: verifyTokenResult.userId,
      username: verifyTokenResult.username,
      isAdmin: verifyTokenResult.isAdmin,
      email: verifyTokenResult.email,
    };

    next();
  } else {
    return new CustomResponse(null, "Need Permissions").error500(res);
  }
};

export const authenticateForUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let jwtToken = req.headers["authorization"] as string;

  if (!jwtToken) {
    return new CustomResponse(null, "Unauthorized").error401(res);
  }

  const verifyTokenResult = verifyToken(jwtToken, res);
  if (verifyTokenResult) {
    req.user = {
      id: verifyTokenResult.userId,
      username: verifyTokenResult.username,
      isAdmin: verifyTokenResult.isAdmin,
      email: verifyTokenResult.email,
    };
    next();
  } else {
    return new CustomResponse(null, "Jwt Expired").error401(res);
  }
};
