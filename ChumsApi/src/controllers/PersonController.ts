import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Person } from "../models"

@controller("/people")
export class PersonController extends CustomBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const data = await this.repositories.person.load(id, au.churchId);
            return this.convertToModel(data);
        });
    }

    @httpGet("/userid/:userId")
    public async getByUserId(@requestParam("userId") userId: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const data = await this.repositories.person.loadByUserId(userId, au.churchId);
            return this.convertToModel(data);
        });
    }

    @httpGet("/search")
    public async search(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const term: string = req.query.term.toString();
            const data = await this.repositories.person.search(au.churchId, term);
            return this.convertAllToModel(data);
        });
    }

    @httpGet("/search/phone")
    public async searchPhone(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const phoneNumber: string = req.query.number.toString();
            const data = await this.repositories.person.searchPhone(au.churchId, phoneNumber);
            return this.convertAllToModel(data);
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const data = await this.repositories.person.loadAll(au.churchId);
            return this.convertAllToModel(data);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Person[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("People", "Edit")) return this.json({}, 401);
            else {
                const promises: Promise<Person>[] = [];
                req.body.forEach(person => { person.churchId = au.churchId; promises.push(this.repositories.person.save(person)); });
                const data = await Promise.all(promises);
                return this.convertAllToModel(data);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("People", "Edit")) return this.json({}, 401);
            else await this.repositories.person.delete(id, au.churchId);
        });
    }


    private convertToModel(data: any) {
        const result: Person = data;
        result.name = { first: data.firstName, last: data.lastName, middle: data.middleName, nick: data.nickName, display: data.displayName, prefix: data.prefix, suffix: data.suffix };
        result.contactInfo = { address1: data.address1, address2: data.address2, city: data.city, state: data.state, zip: data.zip, homePhone: data.homePhone, workPhone: data.workPhone, email: data.email };
        return result;
    }

    private convertAllToModel(data: any[]) {
        const result: Person[] = [];
        data.forEach(d => result.push(this.convertToModel(d)));
        return result;
    }

}
