require("dotenv").config();

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql";
import { connectDatabase } from "./database";

const app = express();
const port = process.env.PORT;

const initApollo = async (app: any) => {
  const db = await connectDatabase();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ db }),
  });
  await server.start();
  //npm dedup
  server.applyMiddleware({ app, path: "/api" });
  app.listen(port);
  console.log(`[app]: http://localhost:${port}`);
};

initApollo(app);
