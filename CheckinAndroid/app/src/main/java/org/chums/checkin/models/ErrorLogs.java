package org.chums.checkin.models;

import com.google.gson.Gson;

import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.Json;
import java.util.ArrayList;

public class ErrorLogs extends ArrayList<ErrorLog> {

    public String toJson()
    {
        return new Gson().toJson(this);
    }

    public static void error(String message)
    {
        log("error", message);
    }

    public static void error(Exception ex)
    {
        log("error", ex.toString());
    }

    public static void info(String message)
    {
        log("info", message);
    }

    private static void log(String level, String message)
    {
        try {
            ErrorLogs logs = new ErrorLogs();
            ErrorLog log = new ErrorLog(level, message);
            logs.add(log);

            String url = CachedData.ApiRoot + "/errors";
            String jsonBody = logs.toJson();
            Json.post(url, jsonBody);
        } catch (Exception ex) {
            ErrorLogs.error(ex);
        }
    }
}
