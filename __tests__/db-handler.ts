/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const mongod = new MongoMemoryServer();

const dbHandler = {
  async connect(): Promise<void> {
    const uri = await mongod.getUri();

    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(uri, mongooseOptions);
  },

  async closeDatabase(): Promise<void> {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  },

  async clearDatabase(): Promise<void> {
    const { collections } = mongoose.connection;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  },
};

export default dbHandler;
