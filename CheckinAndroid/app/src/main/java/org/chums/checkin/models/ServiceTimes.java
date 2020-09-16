package org.chums.checkin.models;

import com.google.gson.Gson;

import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.Json;

import java.util.ArrayList;

public class ServiceTimes  extends ArrayList<ServiceTime> {

    public static ServiceTimes inflate(String json)
    {
        return new Gson().fromJson(json, ServiceTimes.class);
    }

    public static ServiceTimes loadForServiceId(int serviceId)
    {
        ServiceTimes result = null;
        String url = CachedData.ApiRoot + "/servicetimes?serviceId=" + Integer.toString(serviceId) + "&include=groups";
        try {
            String jsonResponse = Json.get(url);
            result = inflate(jsonResponse);
        } catch (Exception ex) {
            ErrorLogs.error(ex);
        }
        return result;
    }

    public ServiceTime getById(int id)
    {
        ServiceTime result = null;
        for (ServiceTime st : this) if (st.getId() ==id) result = st;
        return result;
    }

}