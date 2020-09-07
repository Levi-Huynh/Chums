import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { FundDonation } from "../models"

@controller("/funddonations")
export class FundDonationController extends CustomBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "View")) return this.json({}, 401);
            else return await this.repositories.fundDonation.load(id, au.churchId);
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "View")) return this.json({}, 401);
            else {
                let result;
                if (req.query.donationId !== undefined) result = await this.repositories.fundDonation.loadByDonationId(au.churchId, parseInt(req.query.donationId.toString(), 0));
                else if (req.query.fundId !== undefined) {
                    if (req.query.startDate === undefined) result = await this.repositories.fundDonation.loadByFundId(au.churchId, parseInt(req.query.fundId.toString(), 0));
                    else {
                        const startDate = new Date(req.query.startDate.toString());
                        const endDate = new Date(req.query.startDate.toString());
                        result = await this.repositories.fundDonation.loadByFundIdDate(au.churchId, parseInt(req.query.fundId.toString(), 0), startDate, endDate);
                    }
                } else result = await this.repositories.fundDonation.loadAll(au.churchId);
                return this.repositories.fundDonation.convertAllToModel(au.churchId, result);
            }
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, FundDonation[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "Edit")) return this.json({}, 401);
            else {
                const promises: Promise<FundDonation>[] = [];
                req.body.forEach(funddonation => { funddonation.churchId = au.churchId; promises.push(this.repositories.fundDonation.save(funddonation)); });
                const result = await Promise.all(promises);
                return result;
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "Edit")) return this.json({}, 401);
            else await this.repositories.fundDonation.delete(id, au.churchId);
        });
    }

}
