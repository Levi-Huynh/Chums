package org.chums.checkin.models.accessManagement;

import com.google.gson.Gson;

import java.util.ArrayList;

public class Users extends ArrayList<User> {


    public Users(){}

    public static Users inflate(String json)
    {
        return new Gson().fromJson(json, Users.class);
    }


}
