import { ApiHelper, UserMappingInterface, PermissionInterface, ChurchInterface } from "./ApiHelper";


export class UserHelper {
    static mappings: [UserMappingInterface];
    static church: ChurchInterface;
    static person: { displayName: string };
    static permissions: [PermissionInterface];

    static populate(userMappings: [UserMappingInterface | null]) {
        UserHelper.mappings = userMappings;
        if (UserHelper.mappings.length > 0) {
            UserHelper.church = UserHelper.mappings[0].church;
            var personPromise = ApiHelper.apiGet('/people/' + UserHelper.mappings[0].personId)
                .then(data => UserHelper.person = data);
            var permissionsPromise = ApiHelper.apiGet('/rolepermissions/?personId=' + UserHelper.mappings[0].personId)
                .then(data => UserHelper.permissions = data);

            return Promise.all([personPromise, permissionsPromise]);
        }
        return null;
    }

    static checkAccess(contentType: string, action: string): boolean {
        var result = false;
        if (UserHelper.permissions !== undefined) {
            UserHelper.permissions.forEach(element => {
                if (element.contentType === contentType && element.action === action) result = true;
            });
        }
        return result;
    }

}

