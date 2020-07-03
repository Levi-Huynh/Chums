import { format as dateFormat } from 'date-fns'
import { PersonInterface, HouseholdMemberInterface, CampusInterface, ServiceInterface, ServiceTimeInterface, GroupInterface, GroupServiceTimeInterface } from './ApiHelper';
import Papa from 'papaparse';

export class ImportHelper {

    static getPerson(people: PersonInterface[], personKey: string) {
        for (let i = 0; i < people.length; i++) if (people[i].importKey == personKey) return people[i];
        return null;
    }

    static getHouseholdMembers(householdMembers: HouseholdMemberInterface[], people: PersonInterface[], householdKey: string) {
        var result = [];
        for (let i = 0; i < householdMembers.length; i++) {
            var m = householdMembers[i];
            if (m.householdKey == householdKey) { m.person = this.getPerson(people, m.personKey); result.push(m); }
        }
        return result;
    }

    static getGroupServiceTimesByGroupKey(groupServiceTimes: GroupServiceTimeInterface[], groupKey: string) {
        var result = [];
        for (let i = 0; i < groupServiceTimes.length; i++) if (groupServiceTimes[i].groupKey == groupKey) result.push(groupServiceTimes[i]);
        return result;
    }

    static getServices(services: ServiceInterface[], campusKey: string) {
        var result = [];
        for (let i = 0; i < services.length; i++) if (services[i].campusKey == campusKey) result.push(services[i]);
        return result;
    }

    static getServiceTimes(serviceTimes: ServiceTimeInterface[], serviceKey: string) {
        var result = [];
        for (let i = 0; i < serviceTimes.length; i++) if (serviceTimes[i].serviceKey == serviceKey) result.push(serviceTimes[i]);
        return result;
    }

    static getGroupServiceTimes(groupServiceTimes: GroupServiceTimeInterface[], serviceTimeKey: string) {
        var result = [];
        for (let i = 0; i < groupServiceTimes.length; i++) if (groupServiceTimes[i].serviceTimeKey == serviceTimeKey) result.push(groupServiceTimes[i]);
        return result;
    }

    static getCampus(campuses: CampusInterface[], campusName: string) {
        if (campusName === undefined || campusName === null || campusName === '') return null;
        for (let i = 0; i < campuses.length; i++) if (campuses[i].name === campusName) return campuses[i];
        var result = { name: campusName, importKey: (campuses.length + 1).toString() } as CampusInterface;
        campuses.push(result);
        return result;
    }

    static getService(services: ServiceInterface[], serviceName: string, campus: CampusInterface) {
        if (campus === null || serviceName === undefined || serviceName === null || serviceName === '') return null;
        for (let i = 0; i < services.length; i++) if (services[i].name === serviceName && services[i].campusKey === campus.importKey) return services[i];
        var result = { name: serviceName, importKey: (services.length + 1).toString(), campusKey: campus.importKey } as ServiceInterface;
        services.push(result);
        return result;
    }

    static getServiceTime(serviceTimes: ServiceTimeInterface[], serviceTimeName: string, service: ServiceInterface) {
        if (service === null || serviceTimeName === undefined || serviceTimeName === null || serviceTimeName === '') return null;
        for (let i = 0; i < serviceTimes.length; i++) if (serviceTimes[i].name === serviceTimeName && serviceTimes[i].serviceKey === service.importKey) return serviceTimes[i];
        var result = { name: serviceTimeName, importKey: (serviceTimes.length + 1).toString(), serviceKey: service.importKey } as ServiceTimeInterface;
        serviceTimes.push(result);
        return result;
    }

    static getGroupByKey(groups: GroupInterface[], importKey: string) {
        for (let i = 0; i < groups.length; i++) if (groups[i].importKey === importKey) return groups[i];
        return null;
    }

    static getGroup(groups: GroupInterface[], data: any) {
        var result = this.getGroupByKey(groups, data.importKey) as GroupInterface;
        if (result === null) {
            result = data as GroupInterface;
            if (result.importKey === '') result.importKey = (groups.length + 1).toString();
            groups.push(result);
        }
        return result;
    }

    /*

    static getGroupServiceTime(groupServiceTimes: ServiceTimeInterface[], serviceTimeName: string, service: ServiceInterface) {
        if (service === null || serviceTimeName === undefined || serviceTimeName === null || serviceTimeName === '') return null;
        for (let i = 0; i < serviceTimes.length; i++) if (serviceTimes[i].name === serviceTimeName && serviceTimes[i].serviceKey === service.importKey) return serviceTimes[i];
        var result = { name: serviceTimeName, importKey: (serviceTimes.length + 1).toString(), serviceKey: service.importKey } as ServiceTimeInterface;
        serviceTimes.push(result);
        return result;
    }*/

    static getFile(files: FileList, fileName: string) {
        for (let i = 0; i < files.length; i++) if (files[i].name == fileName) return files[i];
        return null;
    }

    static getCsv(files: FileList, fileName: string, callback: (data: any) => void) {
        var file = this.getFile(files, fileName);
        if (file !== null) this.readCsv(file, callback);
    }

    static readCsv(file: File, callBack: (data: any[]) => void) {
        const reader = new FileReader();
        reader.onload = () => {
            var result = [];
            var csv = reader.result.toString();
            var data = Papa.parse(csv, { header: true });

            for (let i = 0; i < data.data.length; i++) {
                var r: any = this.getStrippedRecord(data.data[i]);
                result.push(r);
            }
            callBack(result);
        };
        reader.readAsText(file);
    }

    static readImage(files: FileList, person: PersonInterface, callback: () => void) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].name === person.photo) {
                const reader = new FileReader();
                reader.onload = () => {
                    person.photo = (reader.result.toString());
                    callback();
                };
                reader.readAsDataURL(files[i]);
            }
        }
    }

    static getStrippedRecord(r: any) {
        var names = Object.getOwnPropertyNames(r)
        for (let j = names.length - 1; j >= 0; j--) {
            var n = names[j];
            if (r[n] == '') delete r[n];
        }
        return r;
    }


}