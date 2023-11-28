import { MongoClient } from "mongodb";
import { Database, Listing } from "../lib/type";

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.mongodb.net/`;

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url, {});

  const db = client.db("main");

  return {
    listings: db.collection<Listing>("test_listings"),
  };
};
