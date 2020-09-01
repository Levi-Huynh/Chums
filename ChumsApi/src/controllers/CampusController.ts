import { controller, httpPost, httpGet, interfaces, requestParam } from "inversify-express-utils";
import { Campus } from "../models";
import express from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { AuthenticatedUser } from '../auth';
import { CustomBaseController } from "./CustomBaseController"

@controller("/campuses")
export class CampusController extends CustomBaseController {

  @httpGet("/:id")
  public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (au.checkAccess("Campuses", "View")) {
        return await this.repositories.campus.load(id);
      }
    });
  }

}
