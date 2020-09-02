import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Donation } from "../models"

@controller("/donations")
export class DonationController extends CustomBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "View Summary")) return this.json({}, 401);
            else return await this.repositories.donation.load(id, au.churchId);
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "View Summary")) return this.json({}, 401);
            else return await this.repositories.donation.loadAll(au.churchId);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Donation[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "Edit")) return this.json({}, 401);
            else {
                const promises: Promise<Donation>[] = [];
                req.body.forEach(donation => { if (donation.churchId === au.churchId) promises.push(this.repositories.donation.save(donation)); });
                const result = await Promise.all(promises);
                return this.json(result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "Edit")) return this.json({}, 401);
            else await this.repositories.donation.delete(id, au.churchId);
        });
    }

}
