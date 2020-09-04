import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Note } from "../models"

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
            else return await this.repositories.note.loadForContent(au.churchId, contentType, contentId);
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
                req.body.forEach(note => { note.churchId = au.churchId; promises.push(this.repositories.note.save(note)); });
                const result = await Promise.all(promises);
                return this.json(result);
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

}
