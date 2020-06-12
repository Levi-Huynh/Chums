package org.chums.checkin.models;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.Json;

import java.util.ArrayList;

public class HouseholdMembers extends ArrayList<HouseholdMember> {

    public HouseholdMember getByPersonId(int personId)
    {
        for (HouseholdMember hm : this) if (hm.Person.Id==personId) return hm;
        return null;
    }

    public static HouseholdMembers inflate(String json)
    {
        return new Gson().fromJson(json, HouseholdMembers.class);
    }

    public static HouseholdMembers loadByPerson(int personId)
    {
        HouseholdMembers result = null;
        String url = CachedData.ApiRoot + "/householdmembers/?personId=" + Integer.toString(personId);
        try {
            String jsonResponse = Json.get(url);
            result = inflate(jsonResponse);
        } catch (Exception ex) {
            int a=0;
        }
        return result;
    }

}
