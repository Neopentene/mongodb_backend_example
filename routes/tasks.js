import express from "express";
// Importing utility functions
import {
  sanitizeEmptyObjects,
  boilerplateResponse,
  checkForUserObject,
  checkForTaskObject,
} from "../utility.js";

// Importing Models
import { Task } from "../models/task.js";
import {
  addTask,
  deleteTask,
  getTasks,
  getUserInfo,
  updateTask,
  updateUserInfo,
} from "../database/db_methods.js";

const tasksRouter = express.Router();

tasksRouter.get("/", async (req, res) => {
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
      if (user.password !== dUser.password)
        return boilerplateResponse(res, "forbidden", "Invalid Creditials");

      if (!user.state)
        return boilerplateResponse(res, "forbidden", "Login First");

      if (user.timeout > new Date().getTime()) {
        const tasks = await getTasks(user.username);
        return boilerplateResponse(
          res,
          "ok",
          `List of ${tasks.length} tasks`,
          undefined,
          tasks
        );
      } else {
        await updateUserInfo(user.username, false);
        return boilerplateResponse(res, "forbidden", "User Login Time Expired");
      }
    }
  } catch (error) {
    console.log(error);
    return boilerplateResponse(res, "internal");
  }
});

tasksRouter.post("/", async (req, res) => {
  const data = sanitizeEmptyObjects(req.query, req.body);
  if (!data) return boilerplateResponse(res, "invalid", "Couldn't Parse Data");

  try {
    let dUser;
    try {
      dUser = checkForUserObject(data, false);
    } catch (error) {
      return boilerplateResponse(res, "bad", error.message);
    }

    const user = await getUserInfo(dUser.username);

    if (user) {
      if (user.password !== dUser.password)
        return boilerplateResponse(res, "forbidden", "Invalid Creditials");

      if (!user.state)
        return boilerplateResponse(res, "forbidden", "Login First");

      if (user.timeout > new Date().getTime()) {
        let task;
        try {
          task = checkForTaskObject(data, false, true);
        } catch (error) {
          return boilerplateResponse(res, "bad", error.message);
        }
        const [result, id] = await addTask(user.username, task.details);
        if (result)
          return boilerplateResponse(
            res,
            "ok",
            "Added Successfully",
            undefined,
            new Task(id, task.details)
          );
        throw Error();
      } else {
        await updateUserInfo(user.username, false);
        return boilerplateResponse(res, "forbidden", "User Login Time Expired");
      }
    }
  } catch (error) {
    console.log(error);
    return boilerplateResponse(res, "internal");
  }
});

tasksRouter.put("/", async (req, res) => {
  const data = sanitizeEmptyObjects(req.query, req.body);
  if (!data) return boilerplateResponse(res, "invalid", "Couldn't Parse Data");

  try {
    let dUser;
    try {
      dUser = checkForUserObject(data, false);
    } catch (error) {
      return boilerplateResponse(res, "bad", error.message);
    }

    const user = await getUserInfo(dUser.username);

    if (user) {
      if (user.password !== dUser.password)
        return boilerplateResponse(res, "forbidden", "Invalid Creditials");

      if (!user.state)
        return boilerplateResponse(res, "forbidden", "Login First");

      if (user.timeout > new Date().getTime()) {
        let task;
        try {
          task = checkForTaskObject(data, false);
        } catch (error) {
          return boilerplateResponse(res, "bad", error.message);
        }

        const result = await updateTask(user.username, task.id, task.details);
        if (result)
          return boilerplateResponse(res, "ok", "Updated Successfully");
        return boilerplateResponse(res, "bad", "Failed to Update");
      } else {
        await updateUserInfo(user.username, false);
        return boilerplateResponse(res, "forbidden", "User Login Time Expired");
      }
    }
  } catch (error) {
    console.log(error);
    return boilerplateResponse(res, "internal");
  }
});

tasksRouter.delete("/", async (req, res) => {
  const data = sanitizeEmptyObjects(req.query, req.body);
  if (!data) return boilerplateResponse(res, "invalid", "Couldn't Parse Data");

  try {
    let dUser;
    try {
      dUser = checkForUserObject(data, false);
    } catch (error) {
      return boilerplateResponse(res, "bad", error.message);
    }

    const user = await getUserInfo(dUser.username);

    if (user) {
      if (user.password !== dUser.password)
        return boilerplateResponse(res, "forbidden", "Invalid Creditials");

      if (!user.state)
        return boilerplateResponse(res, "forbidden", "Login First");

      if (user.timeout > new Date().getTime()) {
        let task;
        try {
          task = checkForTaskObject(data, false, false, true);
        } catch (error) {
          return boilerplateResponse(res, "bad", error.message);
        }
        const result = await deleteTask(user.username, task.id);
        if (result)
          return boilerplateResponse(res, "ok", "Deleted Successfully");
        return boilerplateResponse(res, "bad", "Failed to Delete");
      } else {
        await updateUserInfo(user.username, false);
        return boilerplateResponse(res, "forbidden", "User Login Time Expired");
      }
    }
  } catch (error) {
    console.log(error);
    return boilerplateResponse(res, "internal");
  }
});

export { tasksRouter };
