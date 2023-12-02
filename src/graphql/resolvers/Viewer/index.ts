import { Google } from "../../../lib/api/Google";
import { Database, User, Viewer } from "../../../lib/type";
import { LogInArgs } from "./types";
import crypto from "crypto";
import { Request, Response } from "express";

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true,
};

const loginViaGoogle = async (
  code: string,
  token: string,
  db: Database,
  res: Response
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
      bokings: [],
      listing: [],
      walletId: "",
    });

    viewer = await db.users.findOne({ _id: inserResult.insertedId });
  }

  res.cookie("viewer", userId, {
    ...cookieOptions,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });

  return viewer;
};

const logInViaCookie = async (
  token: string,
  db: Database,
  req: Request,
  res: Response
): Promise<User | undefined | null> => {
  const updateRes = await db.users.findOneAndUpdate(
    { _id: req.signedCookies.viewer },
    { $set: { token } },
    { returnDocument: "after" }
  );

  let viewer = updateRes && updateRes;

  if (!viewer) {
    res.clearCookie("viewer", cookieOptions);
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
          ? await loginViaGoogle(code, token, db, res)
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
      { res }: { res: Response }
    ): Viewer => {
      try {
        res.clearCookie("viewer", cookieOptions);
        return { didRequest: true };
      } catch (error) {
        throw new Error(`Failed to log out: ${error}`);
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
