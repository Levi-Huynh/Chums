package org.chums.checkin.models.accessManagement;

import com.google.gson.Gson;

import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.Json;
import org.chums.checkin.models.ErrorLogs;
import org.chums.checkin.models.People;

public class SwitchAppRequest {
    private String appName;
    private int churchId;

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public int getChurchId() {
        return churchId;
    }

    public void setChurchId(int churchId) {
        this.churchId = churchId;
    }


    public String toJson()
    {
        return new Gson().toJson(this);
    }

    public static LoginResponse switchApp(LoginResponse resp)
    {
        SwitchAppRequest req = new SwitchAppRequest();
        req.churchId = resp.getChurches().get(0).getId();
        req.appName = "CHUMS";

        LoginResponse result = null;
        String url = CachedData.AccessManagementApiRoot + "/users/switchApp/";
        try {
            String jsonResponse = Json.post(url, req.toJson());
            result = LoginResponse.inflate(jsonResponse);
            CachedData.ApiKey = result.getToken();
        } catch (Exception ex) {
            ErrorLogs.error(ex);
        }

        return result;
    }

}
