import { Request, Response } from "express";
import knex from "../database/connection";
import * as Yup from "yup";
import bcrypt from "bcrypt";
import User from '../models/User'


class UserController {
  async create(request: Request, response: Response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      last_name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      whatsapp: Yup.string(),
      genre: Yup.string(),

      nickname: Yup.string().required(),
      isTop: Yup.boolean().required(),
      isJungle: Yup.boolean().required(),
      isMid: Yup.boolean().required(),
      isAdc: Yup.boolean().required(),
      isSup: Yup.boolean().required(),
      champion_pool: Yup.string().required(),
      elo: Yup.string().required(),
      division: Yup.string().required(),
      representative: Yup.boolean().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Validation fails" });
    }

    const userExists = await await knex("users")
      .where("email", request.body.email)
      .first();

    if (userExists) {
      return response.status(400).json({ error: "User already exists." });
    }

    const {
      name,
      last_name,
      email,
      password,
      whatsapp,
      genre,

      nickname,
      isTop,
      isJungle,
      isMid,
      isAdc,
      isSup,
      champion_pool,
      elo,
      division,
      representative,
    } = request.body;

    const trx = await knex.transaction();

    const password_hash = await bcrypt.hash(password, 8);

    const user = {
      name,
      last_name,
      email,
      password_hash,
      whatsapp,
      genre,

      nickname,
      isTop,
      isJungle,
      isMid,
      isAdc,
      isSup,
      champion_pool,
      elo,
      division,
      representative,
    };

    await trx("users").insert(user);

    await trx.commit();

    return response.json(user);
  }

  async update(request: Request, response: Response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      last_name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6),
      whatsapp: Yup.string(),
      genre: Yup.string(),

      nickname: Yup.string(),
      isTop: Yup.boolean(),
      isJungle: Yup.boolean(),
      isMid: Yup.boolean(),
      isAdc: Yup.boolean(),
      isSup: Yup.boolean(),
      champion_pool: Yup.string(),
      elo: Yup.string(),
      division: Yup.string(),
      representative: Yup.boolean(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Validation fails" });
    }

    const { email, oldPassword, password } = request.body;

    //const user = await User.findByPk(request.userId)

    const user = await knex("users").where("id", request.body.id).first();
  
    if (email) {
      if (email !== user.email) {
        const userExists = await knex("users").where("email", email).first();

        if (userExists) {
          return response.status(400).json({ error: "Email ja está sendo utilizado por outra conta!" });
        }
      }
    }

    //checagem se a senha antiga bate com a hash do banco
    let password_hash = '';
    if (oldPassword && password) {
      const oldPassword_hash = await bcrypt.hash(oldPassword, 8);
      if (bcrypt.compare(password, user.password_hash)) {
        console.log(`oldPasswordHash->${oldPassword_hash}`)
        console.log(`user.password_hash->${user.password_hash}`)
        return response.status(401).json({ error: "Senha antiga não confere!" });
      } else {
        password_hash = await bcrypt.hash(password, 8);
      }
    }
    // if (oldPassword && !(await User.checkPassword(oldPassword))) {
    //   return response.status(401).json({ error: "Password does not match" });
    // }

    const {
      name,
      last_name,
      whatsapp,
      genre,

      nickname,
      isTop,
      isJungle,
      isMid,
      isAdc,
      isSup,
      champion_pool,
      elo,
      division,
      representative,
    } = request.body;

    const trx = await knex.transaction();

    const userData = {
      name,
      last_name,
      email,
      whatsapp,
      genre,

      nickname,
      isTop,
      isJungle,
      isMid,
      isAdc,
      isSup,
      champion_pool,
      elo,
      division,
      representative,
    }

    // if(password_hash !== ''){
    //   userData.password_hash = password_hash;
    // }

    await trx("users").where("id", request.body.id).update(userData);

    await trx.commit();

    return response.json({
      success: "Usuario atualizado!",
      user:{
        name,
        last_name,
        email,
        whatsapp,
        genre,
  
        nickname,
        isTop,
        isJungle,
        isMid,
        isAdc,
        isSup,
        champion_pool,
        elo,
        division,
        representative,
      }
    });
  }

  //Busca todos usuários
  async index(request: Request, response: Response) {
    const users = await knex("users").select("id", "name", "last_name", "nickname", "lanes", "champion_pool", "elo");

    return response.json(users);
  }

  // Procura um usuario específico
  async show(request: Request, response: Response) {
    const { id } = request.params;

    const user = await knex("users").where("id", id).first();
    // const user = await knex("users").where("id", id).first().select("id", "name", "last_name", "nickname", "lanes", "champion_pool", "elo");

    if (!user) {
      return response.status(400).json({ message: "Usuário não encontrado." });
    }

    return response.json({ user });
  }
}

export default UserController;
