import { injectable } from "inversify";
import { interfaces } from "inversify-express-utils";
import express from "express";
import jwt from "jsonwebtoken";
import { Principal } from "./";

@injectable()
export class CustomAuthProvider implements interfaces.AuthProvider {
  // public async getUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<interfaces.Principal> {
  public async getUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<Principal> {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      return decoded ? new Principal(decoded) : null;
    }

    return null;
  }
}
