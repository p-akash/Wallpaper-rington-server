import express from "express";
import mediaController from "./media.controller";
import { requireAuth } from "../../authorization/auth.middleware";

export const mediaRouter = express.Router();
mediaRouter.param("id", mediaController.findByParam);
// /api get all data including pulished and not published
mediaRouter
  .route("/")
  .get(mediaController.getMediaList)
  .post(
    requireAuth,
    mediaController.upload.single("imagePath"),
    mediaController.createMedia
  );

mediaRouter.route("/delete-media/:id").delete(mediaController.deleteOne);
mediaRouter.route("/edit-media/:id").put(mediaController.updateMedia);

// following api get only published media
mediaRouter.route("/publish").get(mediaController.getPublishMedia);
mediaRouter.route("/publish/:name").get(mediaController.getPublishMedia);
mediaRouter.route("/publish/:name/:order").get(mediaController.getPublishMedia);
mediaRouter.route("/user-name").get(mediaController.getMediaByUserName);
mediaRouter.route("/category").get(mediaController.getMediaByCategory);
mediaRouter.route("/mediatype").get(mediaController.getMediaByMediaType);
mediaRouter.route("/category/id").get(mediaController.getMediaByCategoryId);
mediaRouter.route("/mediatype/id").get(mediaController.getMediaByMediaTypeId);
mediaRouter.route("/user/id").get(mediaController.getMediaByUserId);
mediaRouter.route("/find/:tag").get(mediaController.getMediaByTag);

// following api get only not published media
mediaRouter.route("/not-publish").get(mediaController.getNotPublishMedia);
