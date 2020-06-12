package org.chums.checkin.models;

import com.google.gson.Gson;

import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.Json;

import java.util.ArrayList;

public class Visits extends ArrayList<Visit> {

    public Visit getByPersonId(int personId)
    {
        Visit result = null;
        for (Visit v : this) if (v.PersonId==personId) result=v;
        return result;
    }

    public void checkin()
    {
        try {
            String url = CachedData.ApiRoot + "/visits/checkin?serviceId=" + Integer.toString(CachedData.ServiceId) + "&householdId=" + Integer.toString(CachedData.HouseholdMembers.get(0).HouseholdId);
            String jsonBody = this.toJson();
            String jsonResponse = Json.post(url, jsonBody);
        } catch (Exception ex) {
            int a=0;
        }
    }

    public static Visits loadForServiceHousehold(int serviceId, int householdId)
    {
        Visits result = null;
        String url = CachedData.ApiRoot + "/visits/checkin?serviceId=" + Integer.toString(serviceId) + "&householdId=" + Integer.toString(householdId) + "&include=visitSessions";
        try {
            String jsonResponse = Json.get(url);
            result = inflate(jsonResponse);
        } catch (Exception ex) {
            int a=0;
        }
        return result;
    }

    public static Visits inflate(String json) { return new Gson().fromJson(json, Visits.class); }

    public String toJson()
    {
        return new Gson().toJson(this);
    }



}
