import express from "express";
import * as actorController from "../controller/actor.controller";
import {
  authenticateForAdmin,
  authenticateForUser,
} from "../middleware/authentication.middleware";
const movieRouter = express.Router();

movieRouter.post("/add", [authenticateForAdmin], actorController.addActor);
movieRouter.get("/get", actorController.getActors);
movieRouter.get("/get/detail/:actorId", actorController.getActorDetailById);
movieRouter.post(
  "/update/:actorId",
  [authenticateForAdmin],
  actorController.updateActor
);
movieRouter.post(
  "/delete",
  [authenticateForAdmin],
  actorController.deleteActor
);

export default movieRouter;
