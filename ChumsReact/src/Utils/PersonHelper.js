class PersonHelper {
    static getPhotoUrl(churchId, personId, photoUpdated) {
        if (photoUpdated == null || photoUpdated < new Date(2000, 1, 1)) return "https://chums.org/images/sample-profile.png";
        else return "https://chums.org/content/c/" + churchId + "/p/" + personId + ".png?dt=" + escape(photoUpdated);
    }

    static getAge(birthdate) {
        if (birthdate !== undefined && birthdate !== '') {
            var ageDifMs = Date.now() - new Date(birthdate);
            var ageDate = new Date(ageDifMs);
            var years = Math.abs(ageDate.getUTCFullYear() - 1970);
            return years + " years";
        }
        else return "";
    }

    static getDisplayName(firstName, lastName, nickName) {
        if (nickName !== undefined && nickName !== null && nickName.length > 0) return firstName + ' "' + nickName + '" ' + lastName;
        else return firstName + ' ' + lastName;
    }



}

export default PersonHelper;