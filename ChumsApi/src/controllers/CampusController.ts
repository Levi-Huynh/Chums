import { controller, httpPost, httpGet, interfaces, requestParam } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Campus } from "../models"

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

  @httpPost("/")
  public async register(req: express.Request<{}, {}, Campus[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      req.body.forEach((campus) => {
        if (campus.churchId === au.churchId) {
          this.repositories.campus.save(campus);
        }
      });



      //if (au.checkAccess("Campuses", "View")) {
      //return await this.repositories.campus.load(id);
      //}
    });
  }

}
