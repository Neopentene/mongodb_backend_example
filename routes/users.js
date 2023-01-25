import express from "express";

// Importing utility functions
import {
  boilerplateResponse,
  sanitizeEmptyObjects,
  checkForUserObject,
} from "../utility.js";

// Importing Configs
import { routerConfig } from "./router_config.js";

// Importing Database Methods
import {
  addUserInfo,
  getUserInfo,
  updateUserInfo,
  getTasks,
} from "../database/db_methods.js";

const usersRouter = express.Router();

// Route for registering new users
usersRouter.post("/new", async (req, res) => {
  const data = sanitizeEmptyObjects(req.body, req.query);

  if (!data) return boilerplateResponse(res, "invalid", "Couldn't Parse Data");

  try {
    let user;
    try {
      user = checkForUserObject(data);
    } catch (error) {
      return boilerplateResponse(res, "bad", error.message);
    }
    user.state = true;
    user.timeout = new Date().getTime() + routerConfig.MAX_LOGIN_TIME;
    const isUsernameTaken = await getUserInfo(user.username);

    if (isUsernameTaken)
      return boilerplateResponse(res, "forbidden", "Username Taken");

    const result = await addUserInfo(user);

    if (result) return boilerplateResponse(res, "accepted");
    else throw Error();
  } catch (error) {
    console.log(error);
    return boilerplateResponse(res, "internal");
  }
});

// Route for user login. Replies with a list of tasks inside data property of response, if user login is successful
usersRouter.get("/in", async (req, res) => {
  const data = sanitizeEmptyObjects(req.query, req.body);

  if (!data) return boilerplateResponse(res, "invalid", "Couldn't Parse Data");

  try {
    let dUser;
    try {
      dUser = checkForUserObject(data);
    } catch (error) {
      return boilerplateResponse(res, "bad", error.message);
    }

    const user = await getUserInfo(dUser.username);

    if (user) {
      if (user.password === dUser.password) {
        const result = await updateUserInfo(
          user.username,
          true,
          routerConfig.MAX_LOGIN_TIME
        );

        if (result) {
          const tasks = await getTasks(user.username);
          return boilerplateResponse(
            res,
            "accepted",
            "Login Successful",
            undefined,
            tasks
          );
        }

        throw Error();
      }
      return boilerplateResponse(res, "forbidden", "Invalid Creditials");
    } else throw Error();
  } catch (error) {
    console.log(error);
    return boilerplateResponse(res, "internal");
  }
});

// Route for logout
usersRouter.post("/out", async (req, res) => {
  const data = sanitizeEmptyObjects(req.body, req.query);

  if (!data) return boilerplateResponse(res, "invalid", "Couldn't Parse Data");

  try {
    let dUser;
    try {
      dUser = checkForUserObject(data);
    } catch (error) {
      return boilerplateResponse(res, "bad", error.message);
    }

    const user = await getUserInfo(dUser.username);

    if (user) {
      if (user.password === dUser.password) {
        const result = await updateUserInfo(dUser.username, false);

        if (result) {
          return boilerplateResponse(res, "ok", "Logout Successful");
        }

        throw Error();
      }
      return boilerplateResponse(res, "forbidden", "Invalid Creditials");
    } else throw Error();
  } catch (error) {
    console.log(error);
    return boilerplateResponse(res, "internal");
  }
});

export { usersRouter };
