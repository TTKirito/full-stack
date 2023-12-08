require("dotenv").config();

import { ObjectId } from "mongodb";
import { connectDatabase } from "../src/database";
import { Listing, ListingType, User } from "../src/lib/type";

const seed = async () => {
  try {
    console.log("[seed]: running...");
    const db = await connectDatabase();

    const listings: Listing[] = [
      {
        _id: new ObjectId(),
        title: "cooper",
        description: "Clean and fully furnished apartment",
        image:
          "https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg?q=85&w=1340",
        host: "114186990765449545089",
        type: ListingType.Apartment,
        address: "170 Nguyen chi thanh, hai chau, da nang, viet nam",
        country: "Viet Nam",
        admin: "Cooper",
        city: "Da Nang",
        bookings: [],
        bokingsIndex: {},
        price: 1234,
        numOfGuests: 3,
      },
    ];

    const users: User[] = [
      {
        _id: "5d378db94e84753160e08b55",
        token: "token_*************",
        name: "Thuan",
        avatar:
          "https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg?q=85&w=1340",
        contact: "thuanton98@gmail.com",
        walletId: "acct_**********",
        income: 723796,
        bokings: [],
        listings: [new ObjectId("114186990765449545089")],
      },
    ];

    for (const listing of listings) {
      await db.listings.insertOne(listing);
    }
    for (const user of users) {
      await db.users.insertOne(user);
    }
    console.log("[seed]: success");
  } catch (err) {
    throw new Error("failed to seed database");
  }
};

seed();
