import { UserHelper } from './UserHelper';

export class PersonHelper {
    static getPhotoUrl(personId: number, photoUpdated: Date): string {
        return 'https://chums-web.s3.us-east-2.amazonaws.com' + this.getPhotoPath(personId, photoUpdated);
        //return this.getPhotoPath(personId, photoUpdated);
        //*** is there a way to map /content/ to an external server with the local dev web server?
    }

    static getPhotoPath(personId: number, photoUpdated: Date): string {
        if (photoUpdated === undefined || photoUpdated === null || photoUpdated < new Date(2000, 1, 1)) return "/images/sample-profile.png";
        else return "/content/c/" + UserHelper.church.id + "/p/" + personId + ".png?dt=" + escape(photoUpdated.toString());
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
