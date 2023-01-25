/**
 * User Object for Referencing
 */
export class User {
  /**
   * @param {string} username - Name of the user
   * @param {string} password - Password of the user
   * @param {boolean | undefined} state - Activity status of the user
   * @param {number | undefined} timeout - Time in milliseconds
   */
  constructor(username, password, state = undefined, timeout = undefined) {
    if (typeof username !== "string") throw Error("Invalid Field Value");
    if (typeof password !== "string") throw Error("Invalid Field Value");
    if (password.length < 8) throw Error("Length of password is too short");

    if (typeof state !== "undefined" && typeof state !== "boolean")
      throw Error("Invalid Field Value");
    if (
      typeof timeout !== "undefined" &&
      typeof timeout !== "number" &&
      timeout < 0
    )
      throw Error("Invalid Field Value");

    this.username = username;
    this.password = password;
    this.state = state;
    this.timeout = timeout;
  }
}

/**
 * Status Object to reference status of the user
 */
export class Status {
  /**
   * @param {string} username - Name of the user
   * @param {boolean} state - State of the user (true if logged in else false)
   * @param {number} timeout - time of state updation
   */
  constructor(username, state, timeout) {
    if (typeof username !== "string") throw Error("Invalid Field Value");
    if (typeof state !== "boolean") throw Error("Invalid Field Value");
    if (typeof timeout !== "number") throw Error("Invalid Field Value");

    this.username = username;
    this.state = state;
    this.timeout = timeout;
  }
}

/**
 * A Default User Object for Key Resolution
 */
export class defaultUserObject {
  constructor() {
    this.username = "";
    this.password = "";
  }
}

/**
 * A Default User Object for Key Resolution
 */
export class defaultUserObjectOnlyName {
  constructor() {
    this.username = "";
  }
}

/**
 * Function to map an object to user
 * @param {object} object - An object with class User fields
 * @param {boolean} fullMap - set to true so state and timeout properties are considered and are not set to default
 * @returns {User} User object
 */
export function mapToUser(object, fullMap = false) {
  if (typeof object !== "object") throw Error("Invalid Field Value");
  const parameters = [
    object.username,
    object.password,
    fullMap ? object.state : false,
    fullMap ? object.timeout : new Date().getTime(),
  ];
  return new User(...parameters);
}
