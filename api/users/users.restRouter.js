import express from "express";
import usersController from "./users.controller";

export const usersRouter = express.Router();

usersRouter.param("id", usersController.findByParam);

usersRouter
  .route("/")
  .get(usersController.getAll)
  .post(usersController.createOne);

usersRouter.route("/create").post(usersController.createNewUser);
usersRouter.route("/userstatus/:status").get(usersController.userStatus);
//usersRouter.route("/inactiveusers").get(usersController.inactiveUsers);
usersRouter.route("/userName/:name").get(usersController.userName);

usersRouter
  .route("/id/:id")
  .get(usersController.getUser)
  .put(usersController.updateUser)
  .delete(usersController.createOne);
