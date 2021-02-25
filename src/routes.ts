import express from "express";

import UserController from "./controllers/UserController";
import SessionController from "./controllers/SessionController";
import ChatController from "./controllers/ChatController"
import MessageController from './controllers/MessageController'

import auth from "./middlewares/auth";

const routes = express.Router();

const userController = new UserController();
const sessionController = new SessionController();
const chatController = new ChatController();
const messageController = new MessageController();

//Rotas chamadas sem autenticação
routes.post("/session", sessionController.create);
routes.post("/user", userController.create);

routes.use(auth);

//Rotas chamadas pós autenticação
routes.get("/users", userController.index);
routes.get("/user/:id", userController.show);
routes.put("/user", userController.update);

routes.post("/chat", chatController.create)
routes.get("/chat", chatController.index)
routes.get("/chat/messages/:chat_id", chatController.show)

routes.post('/message', messageController.create)
routes.get('/message', messageController.index)

export default routes;
