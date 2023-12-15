import { Request, Response, NextFunction } from "express";
import MovieModel from "../data/movie/movie.data";
import CustomResponse from "../utils/custom.response";
import mongoose from "mongoose";
import ActorModel from "../data/talent/actor.data";
import UserModel from "../data/user/user.data";

export const addMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, publishedAt, description, actors, directors, categories } =
      req.body;

    const movie = await MovieModel.create({
      name,
      publishedAt,
      description,
      actors,
      directors,
      categories,
    });
    if (movie) {
      for (const actorId of actors) {
        await ActorModel.findByIdAndUpdate(actorId, {
          $push: {
            movies: movie._id,
          },
        });
      }

      for (const directorId of directors) {
        const director = await ActorModel.findOne({ _id: directorId });
        if (director) {
          const movieIndex = director.movies.findIndex(
            (m) => m._id.toString() === movie._id.toString()
          );

          if (movieIndex === -1) {
            director.movies.push(movie._id);
          }
        } else {
          return new CustomResponse(null, "Not found").error404(res);
        }
      }

      return new CustomResponse(movie, "success").created(res);
    }
    return new CustomResponse(null, "failed").error500(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const getMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageIndex = parseInt(req.query.pageIndex as string);
    const pageSize = parseInt(req.query.pageSize as string);

    const movies = await MovieModel.find({ isDeleted: false })
      .skip(pageIndex * pageSize)
      .limit(pageSize);

    const moviesWithAveragePoint = [];
    for (const movie of movies) {
      const comments = movie.comments;
      if (comments.length > 0) {
        const totalPoints = comments.reduce(
          (acc, comment) => acc + comment.point,
          0
        );
        const averagePoint = totalPoints / comments.length;
        const movieWithAveragePoint = { ...movie.toObject(), averagePoint };
        moviesWithAveragePoint.push(movieWithAveragePoint);
      } else {
        const movieWithAveragePoint = { ...movie.toObject(), averagePoint: 0 };
        moviesWithAveragePoint.push(movieWithAveragePoint);
      }
    }

    if (moviesWithAveragePoint.length > 0) {
      return new CustomResponse(
        { movies: moviesWithAveragePoint },
        "success"
      ).success(res);
    }
    return new CustomResponse(null, "failed").error500(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const getMovieById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserModel.find();
    const movie = await MovieModel.findById(req.params.movieId)
      .populate({
        path: "directors",
        select: "firstName lastName _id",
      })
      .populate({
        path: "actors",
        select: "firstName lastName _id",
      })
      .populate({
        path: "categories",
        select: "name _id",
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "firstName lastName _id",
        },
      });

    if (!movie) {
      return new CustomResponse(null, "Not found").error404(res);
    }

    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return new CustomResponse(null, "Not found").error404(res);
    }

    const isFavorite = user.favorites.includes(movie._id);
    const newComments = [];
    let sum = 0;
    for (let comment of movie.comments) {
      sum += comment.point;
      newComments.push({
        comment: comment,
        myComment: comment.user.id.toString() === req.user.id.toString(),
      });
    }
    sum = sum / movie.comments.length;

    const movieDetails = {
      ...movie.toObject(),
      isFavorite,
      averageTotal: sum,
      newComments,
    };

    return new CustomResponse({ movie: movieDetails }, "success").success(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const updateMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, publishedAt, description, actors, directors, categories } =
      req.body;

    const movie = await MovieModel.findOne({
      isDeleted: false,
      _id: req.body._id,
    });

    if (!movie) {
      return new CustomResponse(null, "Not found").error404(res);
    }

    movie.name = name;
    movie.publishedAt = publishedAt;
    movie.description = description;
    movie.actors = actors;
    movie.directors = directors;
    movie.categories = categories;

    await movie.save();
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const deleteMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movie = await MovieModel.findOne({
      isDeleted: false,
      _id: req.body._id,
    });

    if (!movie) {
      return new CustomResponse(null, "Not found").error404(res);
    }

    movie.isDeleted = true;
    await movie.save();
    return new CustomResponse(null, "success").success(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const getMoviesByCategoryId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageIndex = parseInt(req.query.pageIndex as string);
    const pageSize = parseInt(req.query.pageSize as string);
    let searchQuery = req.query.search as string;

    if (!searchQuery) {
      searchQuery = "";
    }
    const movies = await MovieModel.find({
      isDeleted: false,
      categories: req.params.categoryId,
      name: { $regex: searchQuery, $options: "i" },
    })
      .skip(pageIndex * pageSize)
      .limit(pageSize);

    const moviesWithAveragePoint = [];
    for (const movie of movies) {
      const comments = movie.comments;
      if (comments.length > 0) {
        const totalPoints = comments.reduce(
          (acc, comment) => acc + comment.point,
          0
        );
        const averagePoint = totalPoints / comments.length;
        const movieWithAveragePoint = { ...movie.toObject(), averagePoint };
        moviesWithAveragePoint.push(movieWithAveragePoint);
      } else {
        const movieWithAveragePoint = { ...movie.toObject(), averagePoint: 0 };
        moviesWithAveragePoint.push(movieWithAveragePoint);
      }
    }

    if (moviesWithAveragePoint.length > 0) {
      return new CustomResponse(
        { movies: moviesWithAveragePoint },
        "success"
      ).success(res);
    }

    return new CustomResponse(null, "failed").error500(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const getLatestMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageIndex = parseInt(req.query.pageIndex as string);
    const pageSize = parseInt(req.query.pageSize as string);
    const movies = await MovieModel.find({
      isDeleted: false,
    })
      .sort({ publishedAt: -1 })
      .skip(pageIndex * pageSize)
      .limit(pageSize);

    const moviesWithAveragePoint = [];
    for (const movie of movies) {
      const comments = movie.comments;
      if (comments.length > 0) {
        const totalPoints = comments.reduce(
          (acc, comment) => acc + comment.point,
          0
        );
        const averagePoint = totalPoints / comments.length;
        const movieWithAveragePoint = { ...movie.toObject(), averagePoint };
        moviesWithAveragePoint.push(movieWithAveragePoint);
      } else {
        const movieWithAveragePoint = { ...movie.toObject(), averagePoint: 0 };
        moviesWithAveragePoint.push(movieWithAveragePoint);
      }
    }

    if (moviesWithAveragePoint.length > 0) {
      return new CustomResponse(
        { movies: moviesWithAveragePoint },
        "success"
      ).success(res);
    }

    return new CustomResponse(null, "failed").error500(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { movieId, content, point } = req.body;

    const comment = {
      content: content,
      user: new mongoose.Types.ObjectId(req.user.id),
      point: point,
      createdAt: new Date(),
    };

    const movie = await MovieModel.findById(movieId);

    const existingComment = movie?.comments.find(
      (c) => c.user.toString() === req.user.id
    );

    if (existingComment) {
      return new CustomResponse(
        null,
        "You already add a comment to this film."
      ).error400(res);
    }
    movie?.comments.push(comment);
    await movie?.save();
    return new CustomResponse(null, "success").success(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.body;

    const movie = await MovieModel.findOneAndUpdate(
      { "comments._id": commentId },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    if (!movie) {
      return new CustomResponse(null, "failed").error404(res);
    }
    return new CustomResponse(null, "success").success(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const getTopRatedMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageIndex = parseInt(req.query.pageIndex as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

    if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex < 1 || pageSize < 1) {
      return res.status(400).json({ message: "Invalid query parameters" });
    }

    const pipeline: any[] = [
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "movie",
          as: "comments",
        },
      },
      {
        $addFields: {
          totalPoints: {
            $sum: "$comments.point",
          },
        },
      },
      {
        $sort: {
          totalPoints: -1,
        },
      },
      {
        $skip: (pageIndex - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
    ];

    const movies = await MovieModel.aggregate(pipeline).exec();

    const moviesWithAveragePoint = [];
    for (const movie of movies) {
      const comments = movie.comments;
      if (comments.length > 0) {
        const totalPoints = comments.reduce(
          (acc: number, comment: { point: number }) => acc + comment.point,
          0
        );
        const averagePoint = totalPoints / comments.length;
        const movieWithAveragePoint = { ...movie, averagePoint };
        moviesWithAveragePoint.push(movieWithAveragePoint);
      } else {
        const movieWithAveragePoint = { ...movie, averagePoint: 0 };
        moviesWithAveragePoint.push(movieWithAveragePoint);
      }
    }

    if (moviesWithAveragePoint.length > 0) {
      return new CustomResponse(
        { movies: moviesWithAveragePoint },
        "success"
      ).success(res);
    }

    return new CustomResponse(null, "failed").error500(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const getMostCommentedMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageIndex = parseInt(req.query.pageIndex as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

    if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex < 1 || pageSize < 1) {
      return res.status(400).json({ message: "Invalid query parameters" });
    }

    const pipeline: any[] = [
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "movie",
          as: "comments",
        },
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" },
        },
      },
      {
        $sort: {
          commentCount: -1,
        },
      },
      {
        $skip: (pageIndex - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
    ];

    const movies = await MovieModel.aggregate(pipeline).exec();

    const moviesWithAveragePoint = [];
    for (const movie of movies) {
      const comments = movie.comments;
      if (comments.length > 0) {
        const totalPoints = comments.reduce(
          (acc: number, comment: { point: number }) => acc + comment.point,
          0
        );
        const averagePoint = totalPoints / comments.length;
        const movieWithAveragePoint = { ...movie, averagePoint };
        moviesWithAveragePoint.push(movieWithAveragePoint);
      } else {
        const movieWithAveragePoint = { ...movie, averagePoint: 0 };
        moviesWithAveragePoint.push(movieWithAveragePoint);
      }
    }

    if (moviesWithAveragePoint.length > 0) {
      return new CustomResponse(
        { movies: moviesWithAveragePoint },
        "success"
      ).success(res);
    }

    return new CustomResponse(null, "failed").error500(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const getMoviesReleasedAfterDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageIndex = parseInt(req.query.pageIndex as string);
    const pageSize = parseInt(req.query.pageSize as string);
    const releaseDate = new Date(req.query.releaseDate as string);

    const movies = await MovieModel.find({
      isDeleted: false,
      publishedAt: { $gte: releaseDate },
    })
      .sort({ publishedAt: 1 })
      .skip(pageIndex * pageSize)
      .limit(pageSize);

    return new CustomResponse({ movies }, "success").success(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const getMoviesBySearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageIndex = parseInt(req.query.pageIndex as string);
    const pageSize = parseInt(req.query.pageSize as string);
    const searchQuery = req.query.search as string;

    const movies = await MovieModel.find({
      isDeleted: false,
      name: { $regex: searchQuery, $options: "i" },
    })
      .skip(pageIndex * pageSize)
      .limit(pageSize);

    const moviesWithAveragePoint = [];
    for (const movie of movies) {
      const comments = movie.comments;
      if (comments.length > 0) {
        const totalPoints = comments.reduce(
          (acc: number, comment: { point: number }) => acc + comment.point,
          0
        );
        const averagePoint = totalPoints / comments.length;
        const movieWithAveragePoint = { ...movie.toObject(), averagePoint };
        moviesWithAveragePoint.push(movieWithAveragePoint);
      } else {
        const movieWithAveragePoint = { ...movie.toObject(), averagePoint: 0 };
        moviesWithAveragePoint.push(movieWithAveragePoint);
      }
    }

    if (moviesWithAveragePoint.length > 0) {
      return new CustomResponse(
        { movies: moviesWithAveragePoint },
        "success"
      ).success(res);
    }

    return new CustomResponse(null, "failed").error500(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const likeMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movieId = req.body.movieId;
    const movie = await MovieModel.findById(movieId);

    if (!movie) {
      return new CustomResponse(null, "Not found").error404(res);
    }

    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return new CustomResponse(null, "Not found").error404(res);
    }

    const favoriteIndex = user?.favorites.indexOf(
      new mongoose.Types.ObjectId(movieId)
    );

    if (favoriteIndex === -1) {
      user.favorites.push(new mongoose.Types.ObjectId(movieId));
    } else {
      user.favorites.splice(favoriteIndex, 1);
    }
    await user.save();

    return new CustomResponse(null, "success").success(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};
