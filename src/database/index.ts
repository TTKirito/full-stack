import { MongoClient } from "mongodb";
import { Database, Listing } from "../lib/type";

const user = "thuanton98";
const pass = "thuan123";
const cluster = "cluster0.igcyw";

const url = `mongodb+srv://${user}:${pass}@${cluster}.mongodb.net/`;

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url, {});

  const db = client.db("main");

  return {
    listings: db.collection<Listing>("test_listings"),
  };
};
