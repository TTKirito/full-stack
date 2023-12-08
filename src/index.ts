require("dotenv").config();

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql";
import { connectDatabase } from "./database";
import cookieSession from "cookie-session";
import cors from "cors";
const app = express();
const port = process.env.PORT;

const cookieOptions = {
  signed: false,
  secure: process.env.NODE_ENV === "development" ? false : true,
};

const initApollo = async (app: any) => {
  const db = await connectDatabase();
  app.set("trust proxy", true);
  app.use(cookieSession(cookieOptions));
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });
  await server.start();
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://studio.apollographql.com",
        "https://www.graphql-code-generator.com",
      ],
      credentials: true,
    })
  );
  //npm dedup
  server.applyMiddleware({ app, path: "/api", cors: false });
  app.listen(port);
  console.log(`[app]: http://localhost:${port}`);
};

initApollo(app);
