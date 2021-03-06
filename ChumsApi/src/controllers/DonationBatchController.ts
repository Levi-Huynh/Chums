import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { DonationBatch } from "../models"

@controller("/donationbatches")
export class DonationBatchController extends CustomBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "View Summary")) return this.json({}, 401);
            else {
                const data = await this.repositories.donationBatch.load(au.churchId, id);
                return this.repositories.donationBatch.convertToModel(au.churchId, data);
            }
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "View Summary")) return this.json({}, 401);
            else {
                const data = await this.repositories.donationBatch.loadAll(au.churchId);
                return this.repositories.donationBatch.convertAllToModel(au.churchId, data);
            }
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, DonationBatch[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "Edit")) return this.json({}, 401);
            else {
                const promises: Promise<DonationBatch>[] = [];
                req.body.forEach(donationbatch => { donationbatch.churchId = au.churchId; promises.push(this.repositories.donationBatch.save(donationbatch)); });
                const result = await Promise.all(promises);
                return this.repositories.donationBatch.convertAllToModel(au.churchId, result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "Edit")) return this.json({}, 401);
            else await this.repositories.donationBatch.delete(au.churchId, id);
        });
    }

}
