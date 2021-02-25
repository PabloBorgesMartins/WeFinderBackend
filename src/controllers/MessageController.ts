import { Request, Response } from "express";
import knex from "../database/connection";
import * as Yup from "yup";

require("dotenv-safe").config();
var jwt = require("jsonwebtoken");

class MessageController {
    async create(request: Request, response: Response) {
        const schema = Yup.object().shape({
            user_id: Yup.number().required(),
            chat_id: Yup.number().required(),
            message: Yup.string().required().min(1, "Messagem não recebida"),
        });

        const {
            id,
            chat_id,
            message
        } = request.body

        // const timestamp = new Date(time)
        let data = new Date();
        let data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
        var timestamp = data2.toISOString().replace(/\.\d{3}Z$/, '').replace("T", ' ');

        const messageData = {
            user_id: id,
            chat_id,
            message,
            created_at: timestamp
        }

        if (!(await schema.isValid(messageData))) {
            return response.status(400).json({ error: "Validation Message fails" });
        }


        if (!(await knex("chats").where("chat_id", chat_id).first())) {
            return response.status(404).json({ error: "Chat nao encontrado!" });
        }


        await knex("messages").insert(messageData);

        return response.json({ success: "Mensagem Salva!", message });
    }

    async index(request: Request, response: Response) {
        const { chat_id } = request.body;

        const chatExists = await knex("chats").where("chat_id", chat_id).first();

        if (!chatExists) {
            return response.status(400).json({ message: "Chat não encontrado." });
        }

        const { userPrimary, userSecondary } = chatExists;

        const messages = await knex("messages")
            .where(function() {
                this.where("user_id", userPrimary).orWhere("user_id", userSecondary)
             })
            .andWhere("chat_id", chat_id)  
            .select("*");

        return response.json({messages});
    }

    // async show(request: Request, response: Response) {
    //     const { id } = request.params;

    //     const chat = await knex("chats").where("chat_id", id).first();
    //     // const user = await knex("users").where("id", id).first().select("id", "name", "last_name", "nickname", "lanes", "champion_pool", "elo");

    //     if (!chat) {
    //         return response.status(400).json({ message: "Chat não encontrado." });
    //     }

    //     return response.json({ chat });
    // }

    // async delete(request: Request, response: Response) {
    //     response.json({ auth: false, token: null });
    // }
}

export default MessageController;