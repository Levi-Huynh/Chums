import { Question } from "./";

export class Form {
    public id?: number;
    public churchId?: number;
    public name?: string;
    public contentType?: string;
    public createdTime?: Date;
    public modifiedTime?: Date;

    public questions?: Question[]
}
