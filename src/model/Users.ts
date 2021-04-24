/* eslint-disable func-names */
import { Schema, model, Model, Document } from "mongoose";

import AuthController from "../controller/AuthController";

interface IUser extends Document {
  id: string;
  nome: string;
  email: string;
  senha: string;
  telefones: [{ numero: string; ddd: string }];
  data_criacao: Date;
  data_atualizacao: Date;
  ultimo_login: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  id: { type: String },
  nome: { type: String },
  email: { type: String },
  senha: { type: String },
  telefones: [{ numero: String, ddd: String }],
  data_criacao: { type: Date },
  data_atualizacao: { type: Date },
  ultimo_login: { type: Date },
});

UserSchema.pre("save", function (this: IUser, next) {
  if (!this.isModified("senha")) {
    return next();
  }
  const passwordCrypted = AuthController.createPassword(this.senha);

  this.senha = passwordCrypted;

  return next();
});

const Users: Model<IUser> = model("Users", UserSchema);

export { IUser, Users };
