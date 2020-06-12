package org.chums.checkin.models;

import com.google.gson.Gson;

import org.chums.checkin.R;
import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.Json;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class User {
    public String Email;
    public String Password;
    public String ApiToken;


    public static User login(String email, String password)
    {
        User result = null;
        String url = CachedData.ApiRoot + "/users/login";
        String jsonBody = new User(email, password).toJson();
        try {
            String jsonResponse = Json.post(url, jsonBody);
            result = inflate(jsonResponse);
        } catch (Exception ex) { }
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
        this.Email=email;
        this.Password=password;
    }



}
