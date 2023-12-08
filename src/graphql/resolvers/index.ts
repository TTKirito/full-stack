import { merge } from "lodash";
import { userResolvers } from "./User";
import { viewerResolvers } from "./Viewer";

export const resolvers = merge(userResolvers,viewerResolvers);
