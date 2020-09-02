export class EnvironmentHelper {
    static AccessManagementApiUrl = "";
    static ChumsApiUrl = "";
    static AppUrl = "";

    static init = () => {
        switch (process.env.REACT_APP_STAGE) {
            case "staging": EnvironmentHelper.initStaging(); break;
            case "prod": EnvironmentHelper.initProd(); break;
            default: EnvironmentHelper.initDev(); break;
        }
    }

    static initDev = () => {
        EnvironmentHelper.AccessManagementApiUrl = process.env.REACT_APP_ACCESSMANAGEMENT_API_URL || "";
        EnvironmentHelper.ChumsApiUrl = process.env.REACT_APP_CHUMS_API_URL || "";
        EnvironmentHelper.AppUrl = process.env.REACT_APP_APP_URL || "";
    }

    //NOTE: None of these values are secret.
    static initStaging = () => {
        EnvironmentHelper.AccessManagementApiUrl = "https://api.staging.livecs.org";
        EnvironmentHelper.ChumsApiUrl = "https://api.staging.chums.org";
        EnvironmentHelper.AppUrl = "https://app.staging.chums.org";
    }

    //NOTE: None of these values are secret.
    static initProd = () => {
        EnvironmentHelper.AccessManagementApiUrl = "https://api.livecs.org";
        EnvironmentHelper.ChumsApiUrl = "https://api.chums.org";
        EnvironmentHelper.AppUrl = "https://app.chums.org";
    }

}

