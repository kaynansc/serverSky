import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

export default {
  jwt: {
    secret: process.env.APP_SECRET,
    expiresIn: 60 * 30,
  },
};
