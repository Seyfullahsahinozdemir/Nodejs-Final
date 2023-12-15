import { Request, Response, NextFunction } from "express";
import ActorModel from "../data/talent/actor.data";
import CustomResponse from "../utils/custom.response";
import MovieModel from "../data/movie/movie.data";

export const addActor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newActor = await ActorModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      biography: req.body.biography,
      birthDate: req.body.birthDate,
    });

    if (newActor) {
      return new CustomResponse(newActor, "success").created(res);
    }
    return new CustomResponse(null, "failed").error500(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const getActors = async (
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

    const actors = await ActorModel.find({
      isDeleted: false,
      $or: [
        { firstName: { $regex: searchQuery, $options: "i" } },
        { lastName: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .skip(pageIndex * pageSize)
      .limit(pageSize);

    return new CustomResponse(actors, "success").success(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const getActorDetailById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const actorId = req.params.actorId;
    await MovieModel.find();

    const actor = await ActorModel.findOne({
      _id: actorId,
      isDeleted: false,
    }).populate("movies");

    if (!actor) {
      return new CustomResponse(null, "Not found").error404(res);
    }

    if (!actor.movies || actor.movies.length === 0) {
      actor.movies = [];
    }

    return new CustomResponse(actor, "success").success(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const updateActor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const actor = await ActorModel.findOne({
      isDeleted: false,
      _id: req.params.actorId,
    });

    if (!actor) {
      return new CustomResponse(null, "Not found").error404(res);
    }

    if (req.body.firstName) {
      actor.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      actor.lastName = req.body.lastName;
    }
    if (req.body.biography) {
      actor.biography = req.body.biography;
    }
    if (req.body.birthDate) {
      actor.birthDate = req.body.birthDate;
    }
    await actor.save();
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const deleteActor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const actor = await ActorModel.findOne({
      isDeleted: false,
      _id: req.body.actorId,
    });

    if (!actor) {
      return new CustomResponse(null, "Not found").error404(res);
    }

    actor.isDeleted = true;
    await actor.save();
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};
