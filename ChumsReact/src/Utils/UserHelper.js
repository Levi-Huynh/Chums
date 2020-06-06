import ApiHelper from "./ApiHelper";

class UserHelper {
    static mappings;
    static church;
    static person;
    static permissions;

    static populate(userMappings) {
        UserHelper.mappings = userMappings;
        if (UserHelper.mappings.length > 0) {
            UserHelper.church = UserHelper.mappings[0].church;
            var personPromise = ApiHelper.apiGet('/people/' + UserHelper.mappings[0].personId)
                .then(data => UserHelper.person = data);
            var permissionsPromise = ApiHelper.apiGet('/rolepermissions/?personId=' + UserHelper.mappings[0].personId)
                .then(data => UserHelper.permissions = data);

            return Promise.all([personPromise, permissionsPromise]);
        }
    }

    static checkAccess(contentType, action) {
        var result = false;
        if (UserHelper.permissions !== undefined) {
            UserHelper.permissions.forEach(element => {
                if (element.contentType === contentType && element.action === action) result = true;
            });
        }
        return result;
    }

}

export default UserHelper;