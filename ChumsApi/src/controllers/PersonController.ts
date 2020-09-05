import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete, results } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Person, Household } from "../models"
import { AwsHelper, PersonHelper } from "../helpers"

@controller("/people")
export class PersonController extends CustomBaseController {

    @httpGet("/household/:householdId")
    public async getHouseholdMembers(@requestParam("householdId") householdId: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            return this.convertAllToModel(au.churchId, await this.repositories.person.loadByHousehold(au.churchId, householdId));
        });
    }

    @httpPost("/household/:householdId")
    public async saveMembers(@requestParam("householdId") householdId: number, req: express.Request<{}, {}, Person[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Households", "Edit")) return this.json({}, 401);
            else {
                // save submitted
                const promises: Promise<Person>[] = [];
                req.body.forEach(person => { person.churchId = au.churchId; promises.push(this.repositories.person.updateHousehold(person)); });
                const result = await Promise.all(promises);

                // remove missing
                const removePromises: Promise<any>[] = [];
                const dbPeople = await this.repositories.person.loadByHousehold(au.churchId, householdId);
                dbPeople.forEach((dbPerson: Person) => {
                    let match = false;
                    req.body.forEach(person => { if (person.id === dbPerson.id) match = true; })
                    if (!match) {
                        const p = this.convertToModel(au.churchId, dbPerson);
                        p.churchId = au.churchId;
                        removePromises.push(this.removeFromHousehold(p));
                    }
                });
                if (removePromises.length > 0) await Promise.all(removePromises);
                this.repositories.household.deleteUnused(au.churchId);
                return result;
            }
        });
    }

    private async removeFromHousehold(person: Person) {
        const household: Household = { churchId: person.churchId, name: person.name.last };
        return this.repositories.household.save(household).then(async h => {
            person.householdId = h.id;
            person.householdRole = "Head";
            await this.repositories.person.updateHousehold(person);
        });
    }

    @httpGet("/search/phone")
    public async searchPhone(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const phoneNumber: string = req.query.number.toString();
            const data = await this.repositories.person.searchPhone(au.churchId, phoneNumber);
            return this.convertAllToModel(au.churchId, data);
        });
    }

    @httpGet("/search")
    public async search(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            let term: string = req.query.term.toString();
            if (term === null) term = "";
            const data = await this.repositories.person.search(au.churchId, term);
            return this.convertAllToModel(au.churchId, data);
        });
    }

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const data = await this.repositories.person.load(id, au.churchId);
            return this.convertToModel(au.churchId, data);
        });
    }

    @httpGet("/userid/:userId")
    public async getByUserId(@requestParam("userId") userId: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const data = await this.repositories.person.loadByUserId(userId, au.churchId);
            return this.convertToModel(au.churchId, data);
        });
    }




    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const data = await this.repositories.person.loadAll(au.churchId);
            return this.convertAllToModel(au.churchId, data);
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
                            const r = this.convertToModel(au.churchId, p);
                            if (r.photo.startsWith("data:image/png;base64,")) await this.savePhoto(au.churchId, r);
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


    private convertToModel(churchId: number, data: any) {
        const result: Person = {
            name: { first: data.firstName, last: data.lastName, middle: data.middleName, nick: data.nickName, prefix: data.prefix, suffix: data.suffix },
            contactInfo: { address1: data.address1, address2: data.address2, city: data.city, state: data.state, zip: data.zip, homePhone: data.homePhone, workPhone: data.workPhone, email: data.email },
            photo: data.photo, anniversary: data.anniversary, birthDate: data.birthDate, gender: data.gender, householdId: data.householdId, householdRole: data.householdRole, maritalStatus: data.maritalStatus,
            membershipStatus: data.membershipStatus, photoUpdated: data.photoUpdated, id: data.id, userId: data.userId, importKey: data.importKey
        }
        result.name.display = PersonHelper.getDisplayName(result);
        if (result.photo === undefined) result.photo = PersonHelper.getPhotoUrl(churchId, result);
        return result;
    }



    private convertAllToModel(churchId: number, data: any[]) {
        const result: Person[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

    private async savePhoto(churchId: number, person: Person) {
        const base64 = person.photo.split(',')[1];
        const key = "content/c/" + churchId + "/p/" + person.id + ".png";
        return AwsHelper.S3Upload(key, "image/png", Buffer.from(base64, 'base64')).then(() => {
            person.photoUpdated = new Date();
            person.photo = "/" + key + "?dt=" + person.photoUpdated.getTime().toString();
            this.repositories.person.save(person);
        });
    }




}
