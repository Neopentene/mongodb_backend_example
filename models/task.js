/**
 * Task Object for Referencing
 */
export class Task {
  /**
   * @param {number} id - ID of the task
   * @param {string} details - Details of the task
   */
  constructor(id, details) {
    if (typeof id !== "number") throw Error("Invalid Field Value");
    if (typeof details !== "string") throw Error("Invalid Field Value");
    this.id = id;
    this.details = details;
  }
}

/**
 * A Default Task Object for Key Resolution
 */
export class defaultTaskObject {
  constructor() {
    this.id = -1;
    this.details = "";
  }
}

/**
 * A Default Task Object with no ID for Key Resolution
 */
export class defaultTaskObjectNoID {
  constructor() {
    this.details = "";
  }
}

/**
 * A Default Task Object with no Details for Key Resolution
 */
export class defaultTaskObjectNoDetails {
  constructor() {
    this.id = -1;
  }
}

/**
 * Function to map an object to user
 * @param {object} object - An object with class User fields
 * @param {boolean} ignoreID - To ignore the ID field and set it to -1
 * @param {boolean} ignoreDetails - To ignore the details field and set it to empty string
 * @returns {Task} Task object
 */
export function mapToTask(object, ignoreID = false, ignoreDetails = false) {
  if (typeof object !== "object") throw Error("Invalid Field Value");
  return new Task(
    ignoreID ? -1 : object.id,
    ignoreDetails ? "" : object.details
  );
}
