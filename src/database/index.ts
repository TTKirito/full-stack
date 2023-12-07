import { MongoClient } from "mongodb";
import { Booking, Database, Listing, User } from "../lib/type";

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.mongodb.net/`;

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url, {});

  const db = client.db("main");

  return {
    bookings: db.collection<Booking>("bookings"),
    listings: db.collection<Listing>("listings"),
    users: db.collection<User>("users"),
  };
};
 