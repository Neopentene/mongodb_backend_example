import { User, defaultUserObject, mapToUser } from "./models/user.js";
import { Task, defaultTaskObject, mapToTask } from "./models/task.js";

/**
 *
 * @param {Array} lhs
 * @param {Array} rhs
 * @returns {[Array,Array]}
 */
function swapLists(lhs, rhs) {
  if (!(lhs instanceof Array) || !(rhs instanceof Array))
    throw Error("Invalid Parameters");
  if (lhs.length > rhs.length) return [rhs, lhs];
  return [lhs, rhs];
}

/**
 * Message Types Supported
 */
export class msgTypes {
  ok = [200, undefined, "The request was successful"];
  created = [201, undefined, "The creation was successful"];
  accepted = [202, undefined, "Accepted"];
  bad = [400, "Bad or Invalid Request", "A bad request was sent to the server"];
  invalid = [
    400,
    "Bad or Invalid Request",
    "An invalid request was sent to the server",
  ];
  forbidden = [403, "Forbidden", "This method or Request is Forbidden"];
  notfound = [404, "Not Found", "The resource or method was not found"];
  internal = [
    500,
    "Internal Server Error",
    "Some internal system has failed to respond",
  ];

  /**
   * Set the type of code
   * @param {string} code
   */
  setType(code) {
    const supportedCodes = [
      "ok",
      "created",
      "accepted",
      "bad",
      "invalid",
      "forbidden",
      "notfound",
      "internal",
    ];

    if (typeof code === "string") code = code.toLowerCase();
    if (supportedCodes.indexOf(code) == -1) throw Error("Invalid Message Code");
    this.code = code;
    return this;
  }
}

/**
 * Compares the key and values of two objects
 * @param {object} lhs - Object equality to the left
 * @param {object} rhs - Object equality to the right
 * @param {boolean} strictLength - Equality based on total number of object keys
 * @returns {boolean} Result of equality comparison
 */
export function compareObjects(lhs, rhs, strictLength = true) {
  if (typeof lhs !== "object" || typeof rhs !== "object")
    throw Error("Parameters are not objects");

  let lhsKeys = Object.keys(lhs);
  let rhsKeys = Object.keys(rhs);
  const length =
    lhsKeys.length >= rhsKeys.length ? rhsKeys.length : lhsKeys.length;
  if (strictLength && lhsKeys.length != rhsKeys.length) return false;

  if (!strictLength && lhsKeys.length != rhsKeys.length)
    [lhsKeys, rhsKeys] = swapLists(lhsKeys, rhsKeys);

  // Check for keys
  for (let i = 0; i < length; i++) {
    if (!rhsKeys.includes(lhsKeys[i])) return false;
  }

  // Check for values
  for (let i = 0; i < length; i++) {
    const key = lhsKeys[i];
    if (lhs[key] !== rhs[key]) return false;
  }

  return true;
}

/**
 * Compares the key of two objects
 * @param {object} lhs - Object equality to the left
 * @param {object} rhs - Object equality to the right
 * @param {boolean} strictLength - Equality based on total number of object keys (optional)
 * @returns {boolean} Result of equality comparison
 */
export function compareObjectKeys(lhs, rhs, strictLength = true) {
  if (typeof lhs !== "object" || typeof rhs !== "object")
    throw Error("Parameters are not objects");
  let lhsKeys = Object.keys(lhs);
  let rhsKeys = Object.keys(rhs);
  const length =
    lhsKeys.length >= rhsKeys.length ? rhsKeys.length : lhsKeys.length;
  if (strictLength && lhsKeys.length != rhsKeys.length) return false;

  if (!strictLength && lhsKeys.length != rhsKeys.length)
    [lhsKeys, rhsKeys] = swapLists(lhsKeys, rhsKeys);

  // Check for keys
  for (let i = 0; i < length; i++) {
    if (!rhsKeys.includes(lhsKeys[i])) return false;
  }

  return true;
}

/**
 * Sanitize Objects with no keys
 * @param  {...object} objects Objects to check
 * @returns {object | undefined} Object with all the parameters of objects passed, undefined if all the objects are empty
 */
export function sanitizeEmptyObjects(...objects) {
  const object = objects.reduce((previous, current) => {
    if (current) {
      const currentKeys = Object.keys(current);
      if (previous) {
        currentKeys.forEach((key) => {
          if (!previous[key]) previous[key] = current[key];
        });
        return previous;
      }
      return current;
    }
    return undefined;
  });
  if (object && !compareObjects(object, {})) return object;
  return undefined;
}

/**
 * Checks for whether the object is a valid User object
 * @param {object} data Data object to validate
 * @param {boolean} strictLength - Equality based on total number of object keys (optional)
 * @returns {User} Returns User object if tests pass else returns undefined
 */
export function checkForUserObject(data, strictLength = true) {
  try {
    if (!compareObjectKeys(data, new defaultUserObject(), strictLength))
      throw Error();
  } catch (error) {
    throw Error("Invalid Parameters");
  }

  return mapToUser(data);
}
/**
 * Checks for whether the object is a valid Task object
 * @param {object} data Data object to validate
 * @param {boolean} strictLength - Equality based on total number of object keys (optional)
 * @param {boolean} ignoreID - Consider the ID parameter as necessary - true if not
 * @param {boolean} ignoreDetails - Consider the details parameter as necessary - true if not
 * @returns {Task} Returns Task object if tests pass else returns undefined
 */
export function checkForTaskObject(
  data,
  strictLength = true,
  ignoreID = false,
  ignoreDetails = false
) {
  try {
    const taskObj = new defaultTaskObject();

    if (ignoreID) delete taskObj.id;
    if (ignoreDetails) delete taskObj.details;

    if (!compareObjectKeys(data, taskObj, strictLength)) throw Error();
  } catch (error) {
    throw Error("Invalid Parameters");
  }

  return mapToTask(data, ignoreID, ignoreDetails);
}

/**
 * Matches the given time with current time
 * @param {number} time
 * @returns {boolean} Equality
 */
export function matchTimeInMillis(time) {
  if (typeof time !== "number") throw Error("Invalid Field Value");
  return time >= new Date().getTime();
}

/**
 * @typedef {"ok" | "created" | "accepted" | "bad" | "invalid" | "forbidden" | "notfound" | "internal"} MessageTypes
 */
/**
 * Set a Response Boilerplate
 * @param {Response} res - Response Object
 * @param {MessageTypes} code - Type of Message
 * @param {string | undefined} message - Optional Message Parameter
 * @param {string | undefined} error - Optional Error Parameter
 * @param {any | undefined} data - Optional Data to send
 * @returns A reference the Response Object
 */
export function boilerplateResponse(
  res,
  code,
  message = undefined,
  error = undefined,
  data = undefined
) {
  if (typeof res !== "object") throw Error("Not an Object");
  const type = new msgTypes().setType(code);
  return res
    .status(type[type.code][0])
    .send(
      new Message(
        message ? message : type[type.code][2],
        type[type.code][0],
        error ? error : type[type.code][1]
      )
        .addData(data)
        .getMessage()
    );
}

export class Message {
  /**
   * @param {string} message - Message
   * @param {string | number} status - Status
   * @param {string | number | undefined | null} error - Error
   */
  constructor(message, status, error = undefined) {
    this.message = message;
    this.status = status;
    this.error = error;
  }

  /**
   * Adds data to the message
   * @param {object} data - Data to be added
   * @returns Message
   */
  addData(data) {
    this.data = data;
    return this;
  }

  /**
   * Adds data via a callback
   * @param {function} callback - Callback that returns data to be added
   */
  async addDataViaFunction(callback) {
    if (typeof callback !== "function") throw Error("Not a function");
    this.data = await callback();
    return this;
  }

  getMessage() {
    return {
      message: this.message,
      status: this.status,
      error: this.error,
      data: this.data,
    };
  }
}

export class BadRequestMessage {
  /**
   * @param {string} message - Message
   */
  constructor(message = "A bad request was sent to the server") {
    this.message = message;
    this.status = 400;
    this.error = "Bad or Invalid Request";
  }
}

export class InternalServerErrorMessage {
  /**
   * @param {string} message - Message
   */
  constructor(message = "Some System has failed internally") {
    this.message = message;
    this.status = 500;
    this.error = "Internal Server Error";
  }
}

export class ForbiddenRequestMessage {
  /**
   * @param {string} message - Message
   */
  constructor(message = "This method or request is forbidden") {
    this.message = message;
    this.status = 403;
    this.error = "Forbidden";
  }
}
