import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import authConfig from "../config/auth";

class AuthController {
  generateToken(id: string) {
    return jwt.sign({ id }, authConfig.jwt.secret, {
      expiresIn: authConfig.jwt.expiresIn,
    });
  }

  createPassword(userpassword: string) {
    return bcrypt.hashSync(userpassword, 10);
  }

  comparePassword(userpassword: string, givenpassword: string) {
    return bcrypt.compareSync(userpassword, givenpassword);
  }
}

export default new AuthController();
