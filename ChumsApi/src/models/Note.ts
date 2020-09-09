import { Person } from "./Person";

export class Note {
    public id?: number;
    public churchId?: number;
    public contentType?: string;
    public contentId?: number;
    public noteType?: string;
    public addedBy?: number;
    public dateAdded?: Date;
    public contents?: string;

    public person?: Person;
}
