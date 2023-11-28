require("dotenv").config();

import { ObjectId } from "mongodb";
import { connectDatabase } from "../src/database";
import { Listing } from "../src/lib/type";

const seed = async () => {
  try {
    console.log("[seed]: running...");
    const db = await connectDatabase();

    const listings: Listing[] = [
      {
        _id: new ObjectId(),
        title: "cooper",
        image:
          "https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg?q=85&w=1340",
        address: "170 Nguyen chi thanh, hai chau, da nang, viet nam",
        price: 10000,
        numOfGuests: 2,
        numOfBeds: 1,
        numOfBaths: 2,
        rating: 5,
      },
    ];

    for (const listing of listings) {
      await db.listings.insertOne(listing);
    }

    console.log("[seed]: success");
  } catch (err) {
    throw new Error("failed to seed database");
  }
};

seed();
