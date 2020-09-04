import { PersonInterface } from './ApiHelper';
import { EnvironmentHelper } from '../Components';

export class PersonHelper {
    static getPhotoUrl(person: PersonInterface) {
        return EnvironmentHelper.ContentRoot + person.photo;
    }

    static getAge(birthdate: Date): string {
        if (birthdate !== undefined && birthdate !== null) {
            var ageDifMs = Date.now() - new Date(birthdate).getTime();
            var ageDate = new Date(ageDifMs);
            var years = Math.abs(ageDate.getUTCFullYear() - 1970);
            return years + " years";
        }
        else return "";
    }

    static getDisplayName(firstName: string, lastName: string, nickName: string): string {
        if (nickName !== undefined && nickName !== null && nickName.length > 0) return firstName + ' "' + nickName + '" ' + lastName;
        else return firstName + ' ' + lastName;
    }


}
