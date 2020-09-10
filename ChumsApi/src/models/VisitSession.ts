import { Visit, Session } from "./"

export class VisitSession {
    public id?: number;
    public churchId?: number;
    public visitId?: number;
    public sessionId?: number;

    public visit?: Visit;
    public session?: Session;
}

