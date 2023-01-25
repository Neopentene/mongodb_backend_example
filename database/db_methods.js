import { mongoConfig, connection } from "./db_config.js";
import { User, Status, mapToUser } from "../models/user.js";
import { Task, mapToTask } from "../models/task.js";

/**
 * Get the information of the user from the database
 * @param {string} username - Name of the user
 * @returns {Promise<User | undefined>} User object or null
 */

export async function getUserInfo(username) {
  let instance, collection, user_data;
  try {
    instance = await connection.connect();
    collection = instance
      .db(mongoConfig.databaseName)
      .collection(mongoConfig.collections.users);

    user_data = await collection.findOne({ username: username });
  } catch (error) {
    console.log(error);
  } finally {
    instance.close();
    return user_data ? mapToUser(user_data, true) : undefined;
  }
}

/**
 * Update the user state information on the database
 * @param {string} username - Name of the user
 * @param {boolean} state - State of the user
 * @param {number} extendTimeout Extend the timeout value in milliseconds
 * @returns {Promise<boolean>} True if the value was updated else false
 */
export async function updateUserInfo(username, state, extendTimeout = 0) {
  if (typeof extendTimeout !== "number") throw Error("Invalid Parameters");
  let instance, collection, result;
  try {
    instance = await connection.connect();
    collection = instance
      .db(mongoConfig.databaseName)
      .collection(mongoConfig.collections.users);

    result = await collection.updateOne(
      { username: username },
      { $set: { state: state, timeout: new Date().getTime() + extendTimeout } }
    );
  } catch (error) {
    console.log(error);
  } finally {
    await instance.close();
    return result.acknowledged;
  }
}

/**
 * Add user information in the database
 * @param {User} user - User object with user information
 * @returns {Promise<boolean>} True if the value was updated else false
 */
export async function addUserInfo(user) {
  let instance, collection, result;
  try {
    instance = await connection.connect();
    collection = instance
      .db(mongoConfig.databaseName)
      .collection(mongoConfig.collections.users);

    result = await collection.insertOne(user);
  } catch (error) {
    console.log(error);
  } finally {
    await instance.close();
    return result.acknowledged;
  }
}

/**
 * Get the tasks of a particular user
 * @param {string} username Name of the user
 * @returns {Promise<Task[] | undefined>}
 */
export async function getTasks(username) {
  let instance,
    collection,
    tasks,
    task_list = [];
  try {
    instance = await connection.connect();
    collection = instance
      .db(mongoConfig.databaseName)
      .collection(mongoConfig.collections.tasks);

    tasks = collection.find({ username: username });
    while (await tasks.hasNext()) {
      task_list.push(mapToTask(await tasks.next()));
    }
  } catch (error) {
    console.log(error);
  } finally {
    await instance.close();
    return task_list.length > 0 ? task_list : undefined;
  }
}

/**
 * Add a task of a particular user
 * @param {string} username Name of the user
 * @param {string} details Details of the task
 * @returns {Promise<[boolean, number | undefined] | undefined>} True if the value was added else false
 */
export async function addTask(username, details) {
  let instance, collection, result, id;
  try {
    instance = await connection.connect();
    collection = instance
      .db(mongoConfig.databaseName)
      .collection(mongoConfig.collections.tasks);

    id = collection.find({ username: username }).sort({ id: -1 }).limit(1);

    if (await id.hasNext()) id = mapToTask(await id.next()).id;
    else id = -1;

    await instance.connect();

    result = await collection.insertOne({
      username: username,
      id: ++id,
      details: details,
    });
  } catch (error) {
    console.log(error);
  } finally {
    await instance.close();
    return [result.acknowledged, id];
  }
}

/**
 * Update the task of a particular user
 * @param {string} username Name of the user
 * @param {number} id ID of the task
 * @param {string} details New details of the task
 * @returns {Promise<boolean>} True if the value was updated else false
 */
export async function updateTask(username, id, details) {
  let instance, collection, result;
  try {
    instance = await connection.connect();
    collection = instance
      .db(mongoConfig.databaseName)
      .collection(mongoConfig.collections.tasks);

    result = await collection.updateOne(
      { username: username, id: id },
      { $set: { details: details } }
    );
  } catch (error) {
    console.log(error);
  } finally {
    await instance.close();
    return result.acknowledged && result.modifiedCount > 0;
  }
}

/**
 * Delete the task of the user based on the task id given
 * @param {string} username Name of the user
 * @param {number} id ID of the task
 * @returns {Promise<boolean>} True if the value was deleted else false
 */
export async function deleteTask(username, id) {
  let instance, collection, result;
  try {
    instance = await connection.connect();
    collection = instance
      .db(mongoConfig.databaseName)
      .collection(mongoConfig.collections.tasks);

    result = await collection.deleteOne({ username: username, id: id });
  } catch (error) {
    console.log(error);
  } finally {
    await instance.close();
    return result.acknowledged && result.deletedCount > 0;
  }
}

/**
 * Count the number of tasks present for a user
 * @param {string} username Name of the user
 * @returns {Promise<number | undefined>} Number of tasks
 */
export async function countTasks(username) {
  let instance, collection, result;
  try {
    instance = await connection.connect();
    collection = instance
      .db(mongoConfig.databaseName)
      .collection(mongoConfig.collections.tasks);

    result = await collection.countDocuments({ username: username });
  } catch (error) {
    console.log(error);
  } finally {
    await instance.close();
    return result;
  }
}
