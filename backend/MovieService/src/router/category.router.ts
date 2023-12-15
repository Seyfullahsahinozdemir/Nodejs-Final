import express from "express";
import * as categoryController from "../controller/category.controller";
import { authenticateForAdmin } from "../middleware/authentication.middleware";
const categoryRouter = express.Router();

categoryRouter.post(
  "/add",
  [authenticateForAdmin],
  categoryController.addCategory
);
categoryRouter.get("/get", categoryController.getCategories);
categoryRouter.post(
  "/update/:categoryId",
  [authenticateForAdmin],
  categoryController.updateCategory
);
categoryRouter.post(
  "/delete/:categoryId",
  [authenticateForAdmin],
  categoryController.deleteCategory
);

export default categoryRouter;
