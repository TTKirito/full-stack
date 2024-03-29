import { Google } from "../../../lib/api/Google";
import { Database, User, Viewer } from "../../../lib/type";
import { COnnectStripeArgs, LogInArgs } from "./types";
import crypto from "crypto";
import { Request, Response } from "express";
import { authorize } from "../../../lib/utils";
import { Stripe } from "../../../lib/api/Stripe";

const loginViaGoogle = async (
  code: string,
  token: string,
  db: Database,
  req: Request
): Promise<User | undefined | null> => {
  const { user } = await Google.login(code);

  if (!user) {
    throw new Error("Google login error");
  }

  const userNamesList = user.names && user.names.length ? user.names : null;
  const userPhotsList = user.photos && user.photos.length ? user.photos : null;
  const userEmailsList =
    user.emailAddresses && user.emailAddresses.length
      ? user.emailAddresses
      : null;
  const userName = userNamesList ? userNamesList[0].displayName : null;
  const userId =
    userNamesList && userNamesList[0].metadata?.source
      ? userNamesList[0].metadata.source.id
      : null;
  const userAvatar =
    userPhotsList && userPhotsList[0].url ? userPhotsList[0].url : null;
  const userEmail =
    userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;

  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error("Google login error");
  }

  const updateRes = await db.users.findOneAndUpdate(
    { _id: String(userId) },
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        token,
      },
    },
    { upsert: false, returnDocument: "after" }
  );
  let viewer = updateRes && updateRes;

  if (!viewer) {
    const inserResult = await db.users.insertOne({
      _id: String(userId),
      token,
      name: userName,
      avatar: userAvatar,
      contact: userEmail,
      income: 0,
      bookings: [],
      listings: [],
      walletId: "",
    });

    viewer = await db.users.findOne({ _id: inserResult.insertedId });
  }

  req.session = {
    viewer: userId,
  };

  return viewer;
};

const logInViaCookie = async (
  token: string,
  db: Database,
  req: Request,
  res: Response
): Promise<User | undefined | null> => {
  const updateRes = await db.users.findOneAndUpdate(
    { _id: req.session?.viewer },
    { $set: { token } },
    { returnDocument: "after" }
  );

  let viewer = updateRes && updateRes;

  if (!viewer) {
    req.session = null;
  }

  return viewer;
};

export const viewerResolvers = {
  Query: {
    authUrl: (): string => {
      try {
        return Google.authUrl;
      } catch (error) {
        throw new Error(`Failed to query Google Auth Url: ${error}`);
      }
    },
  },
  Mutation: {
    logIn: async (
      _root: undefined,
      { input }: LogInArgs,
      { db, req, res }: { db: Database; req: Request; res: Response }
    ) => {
      try {
        const code = input ? input.code : null;
        const token = crypto.randomBytes(16).toString("hex");
        const viewer = code
          ? await loginViaGoogle(code, token, db, req)
          : await logInViaCookie(token, db, req, res);
        if (!viewer) {
          return { didRequest: true };
        }

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Failed to query Google Auth Url: ${error}`);
      }
    },
    logOut: (
      _root: undefined,
      _args: {},
      { req }: { req: Request }
    ): Viewer => {
      try {
        req.session = null;
        return { didRequest: true };
      } catch (error) {
        throw new Error(`Failed to log out: ${error}`);
      }
    },
    connectStripe: async (
      _root: undefined,
      { input }: COnnectStripeArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Viewer> => {
      try {
        const { code } = input;

        let viewer = await authorize(db, req);

        if (!viewer) {
          throw new Error("viewer cannot be found");
        }

        const wallet = await Stripe.connect(code);

        if (!wallet) {
          throw new Error("stripe grant error");
        }

        const updateRes = await db.users.findOneAndUpdate(
          { _id: viewer._id },
          { $set: { walletId: wallet.stripe_user_id } },
          { returnDocument: "after" }
        );

        if (!updateRes) {
          throw new Error("viewer could not be updated");
        }

        viewer = updateRes;

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Failed to connect with Stripe: ${error}`);
      }
    },
    disconnectStripe: async (
      _root: undefined,
      _args: {},
      { db, req }: { db: Database; req: Request }
    ): Promise<Viewer> => {
      try {
        let viewer = await authorize(db, req);
        if (!viewer) {
          throw new Error("viewer cannot be found");
        }

        const wallet = await Stripe.disconnect(viewer.walletId);

        if (!wallet) {
          throw new Error("stripe disconnect error");
        }

        const updateRes = await db.users.findOneAndUpdate(
          { _id: viewer._id },
          { $set: { walletId: undefined } },
          { returnDocument: "after" }
        );

        if (!updateRes) {
          throw new Error("viewer could not bi updated");
        }

        viewer = updateRes;
        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Failed to disconnect with Stripe: ${error}`);
      }
    },
  },
  Viewer: {
    id: (viewer: Viewer) => {
      return viewer._id;
    },
    hasWallet: (viewer: Viewer) => {
      return viewer.walletId ? true : undefined;
    },
  },
};
