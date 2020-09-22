import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete, results } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Donation, DonationSummary } from "../models"

@controller("/donations")
export class DonationController extends CustomBaseController {


    @httpGet("/summary")
    public async getSummary(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "View Summary")) return this.json({}, 401);
            else {
                const startDate = (req.query.startDate === undefined) ? new Date(2000, 1, 1) : new Date(req.query.startDate.toString());
                const endDate = (req.query.endDate === undefined) ? new Date() : new Date(req.query.endDate.toString());
                const result = await this.repositories.donation.loadSummary(au.churchId, startDate, endDate);
                return this.repositories.donation.convertAllToSummary(au.churchId, result);
            }
        });
    }

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "View")) return this.json({}, 401);
            else {
                const data = await this.repositories.donation.load(au.churchId, id);
                const result = this.repositories.donation.convertToModel(au.churchId, data);
                if (this.include(req, "person") && result.personId !== null) await this.appendPerson(au.churchId, result);
                return result;
            }
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "View")) return this.json({}, 401);
            else {
                let result;
                if (req.query.batchId !== undefined) result = await this.repositories.donation.loadByBatchId(au.churchId, parseInt(req.query.batchId.toString(), 0));
                else if (req.query.personId !== undefined) result = await this.repositories.donation.loadByPersonId(au.churchId, parseInt(req.query.personId.toString(), 0));
                else result = await this.repositories.donation.loadAll(au.churchId);
                return this.repositories.donation.convertAllToModel(au.churchId, result);
            }
        });
    }


    @httpPost("/")
    public async save(req: express.Request<{}, {}, Donation[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "Edit")) return this.json({}, 401);
            else {
                const promises: Promise<Donation>[] = [];
                req.body.forEach(donation => { donation.churchId = au.churchId; promises.push(this.repositories.donation.save(donation)); });
                const result = await Promise.all(promises);
                return this.repositories.donation.convertAllToModel(au.churchId, result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "Edit")) return this.json({}, 401);
            else await this.repositories.donation.delete(au.churchId, id);
        });
    }

    private async appendPerson(churchId: number, donation: Donation) {
        const data = await this.repositories.person.load(churchId, donation.personId);
        donation.person = this.repositories.person.convertToModel(churchId, data);
    }

}
