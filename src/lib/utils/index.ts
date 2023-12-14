import { Request } from "express";
import { Database, User } from "../type";

export const authorize = async (
  db: Database,
  req: Request
): Promise<User | null> => {
  const token = req.get("X-CSRF-TOKEN");
  const viewer = await db.users.findOne({
    _id: req.session?.viewer,
    token,
  });

  return viewer;
};
