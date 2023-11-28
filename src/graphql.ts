import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

const query = new GraphQLObjectType({
  name: "Query",
  fields: {
    listings: {
      type: GraphQLString,
      resolve: () => "HELLO",
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => "HELLO",
    },
  },
});

const schema = new GraphQLSchema({ query, mutation });
export { schema }