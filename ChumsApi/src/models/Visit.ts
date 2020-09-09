import { Person } from "./";
import { VisitSession } from "./";

export class Visit {
    public id?: number;
    public churchId?: number;
    public personId?: number;
    public serviceId?: number;
    public groupId?: number;
    public visitDate?: Date;
    public checkinTime?: Date;
    public addedBy?: number;

    public person?: Person;
    public visitSessions?: VisitSession[]
}

