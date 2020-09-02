import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { GroupMember } from "../models"

@controller("/groupmembers")
export class GroupMemberController extends CustomBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "View Summary")) return this.json({}, 401);
            else return await this.repositories.groupMember.load(id, au.churchId);
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "View Summary")) return this.json({}, 401);
            else return await this.repositories.groupMember.loadAll(au.churchId);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, GroupMember[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "Edit")) return this.json({}, 401);
            else {
                const promises: Promise<GroupMember>[] = [];
                req.body.forEach(groupmember => { if (groupmember.churchId === au.churchId) promises.push(this.repositories.groupMember.save(groupmember)); });
                const result = await Promise.all(promises);
                return this.json(result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "Edit")) return this.json({}, 401);
            else await this.repositories.groupMember.delete(id, au.churchId);
        });
    }

}
