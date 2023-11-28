import { Collection, ObjectId } from "mongodb";

export interface Listing {
  _id: ObjectId;
  title: string;
  image: string;
  address: string;
  price: number;
  numOfGuests: number;
  numOfBeds: number;
  rating: number;
}

export interface Database {
  listings: Collection<Listing>;
}

// ---

interface IdentityObj<T = number> {
  field: T;
}

const identity = <TData = number, TVariables = number>(arg: TData): TData => {
  const obj: IdentityObj<TData> = {
    field: arg,
  };

  return obj.field;
};

identity<number>(5);
