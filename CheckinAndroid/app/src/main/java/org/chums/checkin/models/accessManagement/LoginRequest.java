package org.chums.checkin.models.accessManagement;

import com.google.gson.Gson;

import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.Json;

public class LoginRequest {
    private String email;
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public LoginRequest(){}
    public LoginRequest(String email, String password)
    {
        this.email=email;
        this.password=password;
    }

    public String toJson()
    {
        return new Gson().toJson(this);
    }

    public static LoginResponse login(String email, String password)
    {
        LoginResponse result = null;
        String url = CachedData.AccessManagementApiRoot + "/users/login";
        String jsonBody = new LoginRequest(email, password).toJson();
        try {
            String jsonResponse = Json.post(url, jsonBody);
            result = LoginResponse.inflate(jsonResponse);
            if (result.getToken() != null) {
                CachedData.ApiKey = result.getToken();
                result = SwitchAppRequest.switchApp(result);
            }
        } catch (Exception ex) {
            int a=0;
        }
        return result;
    }

}
