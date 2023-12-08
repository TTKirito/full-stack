import { Listing } from "../../../lib/type";

export const listingResolvers = {
  Listing: {
    id: (listing: Listing): string => {
      return listing._id.toString();
    },
  },
};
