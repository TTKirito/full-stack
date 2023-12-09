import { Listing } from "../../../lib/type";

export const listingResolvers = {
  Query: {
    listing: () => {
      return "Query.listing";
    },
  },
  Listing: {
    id: (listing: Listing): string => {
      return listing._id.toString();
    },
  },
};
