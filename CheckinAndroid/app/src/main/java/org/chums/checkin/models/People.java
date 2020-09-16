package org.chums.checkin.models;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.Json;

import java.util.ArrayList;

public class People extends ArrayList<Person> {
    public People(){}

    public static People inflate(String json)
    {
        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
        return gson.fromJson(json, People.class);
    }

    public static People searchPhone(String number)
    {
        People result = null;
        String url = CachedData.ApiRoot + "/people/search/phone?number=" + number;
        try {
            String jsonResponse = Json.get(url);
            result = inflate(jsonResponse);
        } catch (Exception ex) {
            ErrorLogs.error(ex);
        }
        return result;
    }

    public Person getById(int id)
    {
        Person result = null;
        for (Person person : this)
        {
            if (person.getId()==id) result = person;
        }
        return result;
    }

    public static People loadForHousehold(int householdId)
    {
        People result = null;
        String url = CachedData.ApiRoot + "/people/household/" + Integer.toString(householdId);
        try {
            String jsonResponse = Json.get(url);
            result = inflate(jsonResponse);
        } catch (Exception ex) {
            ErrorLogs.error(ex);
        }
        return result;
    }

}
