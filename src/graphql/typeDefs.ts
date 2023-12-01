import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Viewer {
    id: ID
    toke: String
    avatar: String
    hasWallet: Boolean
    didRequest: Boolean!
  }
  input LogInInput {
    code: String!
  }

  type Query {
    authUrl: String!
  }

  type Mutation {
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!
  }
`;
 