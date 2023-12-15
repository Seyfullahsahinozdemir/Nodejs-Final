import express from "express";
import * as movieController from "../controller/movie.controller";
import {
  authenticateForAdmin,
  authenticateForUser,
} from "../middleware/authentication.middleware";
const movieRouter = express.Router();

movieRouter.post("/add", [authenticateForAdmin], movieController.addMovie);
movieRouter.get("/get/latest", movieController.getLatestMovies);
movieRouter.get("/get/top-rated", movieController.getTopRatedMovies);
movieRouter.get("/get/most-commented", movieController.getMostCommentedMovies);
movieRouter.get("/get/search", movieController.getMoviesBySearch);
movieRouter.get(
  "/get/:movieId",
  [authenticateForUser],
  movieController.getMovieById
);
movieRouter.get(
  "/get/category/:categoryId",
  movieController.getMoviesByCategoryId
);
movieRouter.get("/get", movieController.getMovies);

movieRouter.post(
  "/comment/add",
  [authenticateForUser],
  movieController.addComment
);
movieRouter.post(
  "/comment/delete",
  [authenticateForUser],
  movieController.deleteComment
);
movieRouter.post("/like", [authenticateForUser], movieController.likeMovie);

movieRouter.post(
  "/delete",
  [authenticateForAdmin],
  movieController.deleteMovie
);

export default movieRouter;
