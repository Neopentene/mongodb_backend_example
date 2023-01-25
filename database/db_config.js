import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

/**
 * Class to configure mongodb initially
 */
class MongoConfig {
  constructor() {
    this.url = process.env.URL;
    this.databaseName = process.env.DATABASE_NAME;
    this.collections = {
      tasks: process.env.COLLECTION_TASKS,
      users: process.env.COLLECTION_USERS,
    };
    this.mongoOptions = {
      minPoolSize: 100,
    };
  }
}

export const mongoConfig = new MongoConfig();
const connection = new MongoClient(mongoConfig.url, mongoConfig.mongoOptions);

connection.on("error", (error) => {
  console.log(error);
  connection.close();
});

export { connection };
