package org.chums.checkin.models.accessManagement;

import com.google.gson.Gson;

import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.Json;

public class User {
    private String email;
    private String password;
    private String token;




    public String toJson()
    {
        return new Gson().toJson(this);
    }

    public static User inflate(String json)
    {
        return new Gson().fromJson(json, User.class);
    }


    public User(){}



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
