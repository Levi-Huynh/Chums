package org.chums.checkin.models;

import com.google.gson.Gson;

import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.Json;
import org.json.JSONObject;

import java.util.ArrayList;

public class Users extends ArrayList<User> {


    public Users(){}

    public static Users inflate(String json)
    {
        return new Gson().fromJson(json, Users.class);
    }


}
