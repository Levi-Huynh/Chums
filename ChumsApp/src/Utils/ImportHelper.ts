import { format as dateFormat } from 'date-fns'
import { PersonInterface, HouseholdMemberInterface } from './ApiHelper';
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