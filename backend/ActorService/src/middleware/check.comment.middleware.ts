import { Request, Response, NextFunction } from "express";
import MovieModel from "../data/movie/movie.data";
import CustomResponse from "../utils/custom.response";

export const checkAlreadyExistComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movie = await MovieModel.findById(req.body.movieId);

    if (!movie) {
      return new CustomResponse(null, "Movie not found").error404(res);
    }

    const existingComment = movie.comments.find(
      (c) => c.user.toString() === req.user.id
    );

    if (existingComment) {
      return new CustomResponse(
        null,
        "You already add a comment to this film."
      ).error400(res);
    }
    next();
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};
