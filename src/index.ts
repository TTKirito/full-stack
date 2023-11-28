import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql";

const app = express();
const port = 9000;

const initApollo = async (app: any) => {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  //npm dedup
  server.applyMiddleware({ app, path: "/api" });
};

initApollo(app);

app.listen(port);

console.log(`[app]: http://localhost:${port}`);

const one: number = 1;
