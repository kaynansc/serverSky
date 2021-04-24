import { Router, Request, Response } from "express";

import UsersController from "../controller/UsersController";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const usersRoutes = Router();

usersRoutes.post("/user/signup", UsersController.signUp);

usersRoutes.post("/user/signin", UsersController.signIn);

usersRoutes.get("/user/:id", ensureAuthenticated, UsersController.getUser);

export { usersRoutes };
