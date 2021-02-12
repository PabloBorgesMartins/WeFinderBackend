import express from "express";

import UserController from "./controllers/UserController";
import SessionController from "./controllers/SessionController";

import auth from "./middlewares/auth";

const routes = express.Router();

const userController = new UserController();
const sessionController = new SessionController();

//Rotas chamadas sem autenticação
routes.post("/session", sessionController.create);
routes.post("/user", userController.create);

routes.use(auth);

//Rotas chamadas pós autenticação
routes.get("/users", userController.index);
routes.get("/user/:id", userController.show);
routes.put("/user", userController.update);

export default routes;
