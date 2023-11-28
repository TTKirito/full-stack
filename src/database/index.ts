import { MongoClient } from "mongodb";

const user = "thuanton98";
const pass = "thuan123";
const cluster = "cluster0.igcyw";

const url = `mongodb+srv://${user}:${pass}@${cluster}.mongodb.net/`;

export const connectDatabase = async () => {
    const client = await MongoClient.connect(url, {})

    const db = client.db('main');

    return {
        listings: db.collection("test_listings")
    }
};
