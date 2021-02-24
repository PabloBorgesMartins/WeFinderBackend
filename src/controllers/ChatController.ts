import { Request, Response } from "express";
import knex from "../database/connection";
import * as Yup from "yup";
import bcrypt from "bcrypt";

require("dotenv-safe").config();
var jwt = require("jsonwebtoken");

class ChatController {
  async create(request: Request, response: Response) {
    const schema = Yup.object().shape({
      userSecondary: Yup.number().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Validation Chat fails" });
    }

    const { id, userSecondary} = request.body;

    const dataChat = {
        userPrimary: id,
        userSecondary
    }

    await knex("chats").insert(dataChat);

    return response.json({ success:"Sala criada!" });
  }

  async index(request: Request, response: Response) {
    const chats = await knex("chats").select("*");

    return response.json(chats);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const user = await knex("users").where("id", id).first();
    // const user = await knex("users").where("id", id).first().select("id", "name", "last_name", "nickname", "lanes", "champion_pool", "elo");

    if (!user) {
      return response.status(400).json({ message: "Usuário não encontrado." });
    }

    return response.json({ user });
  }

  async delete(request: Request, response: Response) {
    response.json({ auth: false, token: null });
  }
}

export default ChatController;