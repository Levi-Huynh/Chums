package org.chums.checkin.models.accessManagement;

import com.google.gson.Gson;

import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.Json;

public class LoginResponse {
    private User user;
    private Churches churches;
    private String token;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Churches getChurches() {
        return churches;
    }

    public void setChurches(Churches churches) {
        this.churches = churches;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }



    public static LoginResponse inflate(String json)
    {
        return new Gson().fromJson(json, LoginResponse.class);
    }

}
