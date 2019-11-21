import express from "express";
import categoryController from "./category.controller";

export const categoryRouter = express.Router();

categoryRouter.param("id", categoryController.findByParam);

categoryRouter
  .route("/")
  .get(categoryController.getAll)
  .post(categoryController.createOne);
categoryRouter.route("/id/:id").get(categoryController.getOne);
categoryRouter.route("/edit-category/:id").put(categoryController.updateOne);
categoryRouter
  .route("/delete-category/:id")
  .delete(categoryController.deleteOne);
