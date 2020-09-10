package org.chums.checkin.models;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.chums.checkin.R;
import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.Json;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class User {
    private String email;
    private String password;
    private String token;


    public static User login(String email, String password)
    {
        User result = null;
        String url = CachedData.AccessManagementApiRoot + "/users/login";
        String jsonBody = new User(email, password).toJson();
        try {
            String jsonResponse = Json.post(url, jsonBody);
            result = inflate(jsonResponse);
        } catch (Exception ex) {
            int a=0;
        }
        return result;
    }

    public String toJson()
    {
        return new Gson().toJson(this);
    }

    public static User inflate(String json)
    {
        return new Gson().fromJson(json, User.class);
    }


    public User(){}
    public User(String email, String password)
    {
        this.email=email;
        this.password=password;
    }


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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
