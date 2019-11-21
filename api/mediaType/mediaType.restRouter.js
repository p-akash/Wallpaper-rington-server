import express from "express";

import mediaTypeController from "./mediatype.controller";

export const mediaTypeRouter = express.Router();

mediaTypeRouter.param("id", mediaTypeController.findByParam);

mediaTypeRouter
  .route("/")
  .get(mediaTypeController.getAll)
  .post(mediaTypeController.createOne);
mediaTypeRouter.route("/id/:id").get(mediaTypeController.getOne);
mediaTypeRouter.route("/edit-mediatype/:id").put(mediaTypeController.updateOne);
mediaTypeRouter
  .route("/delete-mediatype/:id")
  .delete(mediaTypeController.deleteOne);
