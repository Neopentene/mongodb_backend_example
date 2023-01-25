import dotenv from "dotenv";
dotenv.config();

export const routerConfig = {
  MAX_LOGIN_TIME: Number.parseInt(process.env.MAX_LOGIN_TIME),
};
