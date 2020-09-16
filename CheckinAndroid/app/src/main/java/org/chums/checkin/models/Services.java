package org.chums.checkin.models;
import com.google.gson.Gson;

import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.Json;

import java.util.ArrayList;

public class Services extends ArrayList<Service> {

    public static Services inflate(String json)
    {
        return new Gson().fromJson(json, Services.class);
    }

    public static Services loadAll()
    {
        Services result = null;
        String url = CachedData.ApiRoot + "/services";
        try {
            String jsonResponse = Json.get(url);
            result = inflate(jsonResponse);
        } catch (Exception ex) {
            ErrorLogs.error(ex);
        }
        return result;
    }

}
