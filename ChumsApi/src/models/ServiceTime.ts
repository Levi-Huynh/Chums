import { Group } from "./";

export class ServiceTime {
    public id?: number;
    public churchId?: number;
    public serviceId?: number;
    public name?: string;

    public longName?: string;
    public groups?: Group[];
}
