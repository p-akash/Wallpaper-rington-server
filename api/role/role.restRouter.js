import express from "express";
import roleController from "./role.controller";

export const roleRouter = express.Router();

roleRouter.param("id", roleController.findByParam);

roleRouter
  .route("/")
  .get(roleController.getAll)
  .post(roleController.createOne);
roleRouter.route("/id/:id").get(roleController.getOne);
roleRouter.route("/edit-role/:id").put(roleController.updateOne);
roleRouter.route("/delete-role/:id").delete(roleController.deleteOne);
