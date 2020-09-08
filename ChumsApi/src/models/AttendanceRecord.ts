import { Campus, Service, Group, ServiceTime } from "./"

export class AttendanceRecord {
    public campus?: Campus;
    public service?: Service;
    public serviceTime?: ServiceTime;
    public group?: Group;
    public visitDate?: Date;
    public week?: number;
    public count?: number;
    public gender?: string;
}
