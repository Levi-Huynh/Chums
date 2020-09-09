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
            else return this.repositories.note.convertToModel(au.churchId, await this.repositories.note.load(au.churchId, id));
        });
    }

    @httpGet("/:contentType/:contentId")
    public async getForContent(@requestParam("contentType") contentType: string, @requestParam("contentId") contentId: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("People", "View Notes")) return this.json({}, 401);
            else return await this.repositories.note.loadForContent(au.churchId, contentType, contentId).then(data => {
                return this.repositories.note.convertAllToModel(au.churchId, data)
            });
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("People", "View Notes")) return this.json({}, 401);
            else return this.repositories.note.convertAllToModel(au.churchId, await this.repositories.note.loadAll(au.churchId));
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
                return this.repositories.note.convertAllToModel(au.churchId, result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("People", "Edit Notes")) return this.json({}, 401);
            else await this.repositories.note.delete(au.churchId, id);
        });
    }




}
