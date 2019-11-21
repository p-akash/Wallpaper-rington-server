import express from "express";

import { usersRouter } from "./users";
import { roleRouter } from "./role";
import { categoryRouter } from "./category";
import { mediaTypeRouter } from "./mediatype";
import { mediaRouter } from "./media";

export const restRouter = express.Router();

// The authorization routes go here Api Routs
restRouter.use("/users", usersRouter);
restRouter.use("/role", roleRouter);
restRouter.use("/category", categoryRouter);
restRouter.use("/mediatype", mediaTypeRouter);
restRouter.use("/media", mediaRouter);
