import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Note } from "../models"
import { PersonHelper } from "../helpers";

@controller("/notes")
export class NoteController extends CustomBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("People", "View Notes")) return this.json({}, 401);
            else return await this.repositories.note.load(id, au.churchId);
        });
    }

    @httpGet("/:contentType/:contentId")
    public async getForContent(@requestParam("contentType") contentType: string, @requestParam("contentId") contentId: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("People", "View Notes")) return this.json({}, 401);
            else return await this.repositories.note.loadForContent(au.churchId, contentType, contentId).then(data => {
                return this.convertAllToModel(au.churchId, data)
            });
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("People", "View Notes")) return this.json({}, 401);
            else return await this.repositories.note.loadAll(au.churchId);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Note[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("People", "Edit Notes")) return this.json({}, 401);
            else {
                const promises: Promise<Note>[] = [];
                req.body.forEach(note => { note.churchId = au.churchId; note.addedBy = au.id; promises.push(this.repositories.note.save(note)); });
                const result = await Promise.all(promises);
                return result;
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("People", "Edit Notes")) return this.json({}, 401);
            else await this.repositories.note.delete(id, au.churchId);
        });
    }

    private convertToModel(churchId: number, data: any) {
        const result: Note = {
            person: { photoUpdated: data.photoUpdate, name: { first: data.firstName, last: data.lastName, nick: data.nickName } },
            contentId: data.contentId, contentType: data.contentType, contents: data.contents, id: data.id, addedBy: data.addedBy, dateAdded: data.dateAdded, noteType: data.noteType
        }
        result.person.photo = PersonHelper.getPhotoUrl(churchId, result.person);
        result.person.name.display = PersonHelper.getDisplayName(result.person);
        return result;
    }


    private convertAllToModel(churchId: number, data: any[]) {
        const result: Note[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }



}
