import { Collection, ObjectId } from "mongodb";

export interface Booking {
  _id: ObjectId;
}

export interface Listing {
  _id: ObjectId;
}

export interface User {
  _id: ObjectId
}

export interface Database {
  bookings: Collection<Booking>;
  listings: Collection<Listing>;
  users: Collection<User>
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
