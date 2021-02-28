import { Request, Response } from "express";
import knex from "../database/connection";
import * as Yup from "yup";

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

    const { id, userSecondary } = request.body;

    const dataChat = {
      userPrimary: id,
      userSecondary
    }

    const [chat_id] = await knex("chats").insert(dataChat);

    return response.json({ success: "Sala criada!", chat_id });
  }

  async index(request: Request, response: Response) {
    console.log('entrou no chat.index')
    const { id } = request.body;

    const chats =
      await knex("chats")
        .where("userPrimary", id)
        .orWhere("userSecondary", id)
        .select("*");

    return response.json(chats);
  }

  async show(request: Request, response: Response) {
    const { chat_id } = request.params;

    const chatExists = await knex("chats").where("chat_id", chat_id).first();

    if (!chatExists) {
      return response.status(400).json({ error: "Chat não encontrado." });
    }

    const { id } = request.body;

    const { userPrimary, userSecondary } = chatExists;

    if(id != userPrimary && id != userSecondary){
      return response.status(401).json({ error: "Sem autorização para esse chat!." });
    }

    const messages = await knex("messages")
      .where(function () {
        this.where("user_id", userPrimary).orWhere("user_id", userSecondary)
      })
      .andWhere("chat_id", chat_id)
      .select("*");

    return response.json({ messages });
  }

  async delete(request: Request, response: Response) {
    response.json({ auth: false, token: null });
  }
}

export default ChatController;