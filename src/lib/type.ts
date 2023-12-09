import { Collection, ObjectId } from "mongodb";

// const bookingsIndex = {
//   '2019': {
//     "00": {
//       "01": true,
//       "02": true
//     },
//     "04": {
//       "31": true
//     }
//   }
// }

export interface Viewer {
  _id?: string;
  token?: string;
  avatar?: string;
  walletId?: string;
  didRequest: boolean;
}

export enum ListingType {
  Apartment = "APARTMENT",
  House = "HOUSE",
}

export interface BookingsIndexMonth {
  [key: string]: boolean;
}

export interface BookingIndexYear {
  [key: string]: BookingsIndexMonth;
}

export interface BookingIndex {
  [key: string]: BookingIndexYear;
}

export interface Booking {
  _id: ObjectId;
  listing: ObjectId;
  tenant: string;
  checkIn: string;
  checkOut: string;
}

export interface Listing {
  _id: ObjectId;
  title: string;
  description: string;
  image: string;
  host: string;
  type: ListingType;
  address: string;
  country: string;
  admin: string;
  city: string;
  bookings: ObjectId[];
  bookingsIndex: BookingIndex;
  price: number;
  numOfGuests: number;
  authorized?: boolean;
}

export interface User {
  _id: string;
  token: string;
  name: string;
  avatar: string;
  contact: string;
  walletId: string;
  income: number;
  bokings: ObjectId[];
  listings: ObjectId[];
  authorized?: boolean;
}

export interface Database {
  bookings: Collection<Booking>;
  listings: Collection<Listing>;
  users: Collection<User>;
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
