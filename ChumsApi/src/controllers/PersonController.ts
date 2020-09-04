import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete, results } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Person } from "../models"
import { AwsHelper, PersonHelper } from "../helpers"

@controller("/people")
export class PersonController extends CustomBaseController {

    @httpGet("/search/phone")
    public async searchPhone(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const phoneNumber: string = req.query.number.toString();
            const data = await this.repositories.person.searchPhone(au.churchId, phoneNumber);
            return this.convertAllToModel(data);
        });
    }

    @httpGet("/search")
    public async search(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            let term: string = req.query.term.toString();
            if (term === null) term = "";
            const data = await this.repositories.person.search(au.churchId, term);
            return this.convertAllToModel(data);
        });
    }

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
                req.body.forEach(person => {
                    person.churchId = au.churchId;
                    promises.push(
                        this.repositories.person.save(person).then(async (p) => {
                            const r = this.convertToModel(p);
                            if (r.photo.startsWith("data:image/png;base64,")) await this.savePhoto(r);
                            return r;
                        })
                    );
                });
                return await Promise.all(promises);
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
        const result: Person = {
            name: { first: data.firstName, last: data.lastName, middle: data.middleName, nick: data.nickName, prefix: data.prefix, suffix: data.suffix },
            contactInfo: { address1: data.address1, address2: data.address2, city: data.city, state: data.state, zip: data.zip, homePhone: data.homePhone, workPhone: data.workPhone, email: data.email },
            photo: data.photo, anniversary: data.anniversary, birthDate: data.birthDate, gender: data.gender, householdId: data.householdId, householdRole: data.householdRole, maritalStatus: data.maritalStatus,
            membershipStatus: data.membershipStatus, photoUpdated: data.photoUpdated, id: data.id, userId: data.userId
        }
        result.name.display = PersonHelper.getDisplayName(result);
        if (result.photo === undefined) result.photo = PersonHelper.getPhotoUrl(result);
        return result;
    }



    private convertAllToModel(data: any[]) {
        const result: Person[] = [];
        data.forEach(d => result.push(this.convertToModel(d)));
        return result;
    }

    private async savePhoto(person: Person) {
        const base64 = person.photo.split(',')[1];
        const key = "content/c/" + person.churchId + "/p/" + person.id + ".png";
        return AwsHelper.S3Upload(key, "image/png", Buffer.from(base64, 'base64')).then(() => {
            person.photoUpdated = new Date();
            person.photo = "/" + key + "?dt=" + person.photoUpdated.getTime().toString();
            this.repositories.person.save(person);
        });
    }




}
