import express, { Application } from "express";

import returnResponseError from "./middlewares/returnResponseError";
import routeNotFound from "./middlewares/routeNotFound";
import { usersRoutes } from "./routes/users.routes";

class AppController {
  public express: Application;

  constructor() {
    this.express = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    this.express.use(usersRoutes);
    this.express.use(routeNotFound);
    this.express.use(returnResponseError);
  }
}

export default new AppController().express;
