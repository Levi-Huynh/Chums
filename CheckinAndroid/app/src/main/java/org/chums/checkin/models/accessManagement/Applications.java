package org.chums.checkin.models.accessManagement;
import com.google.gson.Gson;
import java.util.ArrayList;

public class Applications extends ArrayList<Application> {
    public static Applications inflate(String json)
    {
        return new Gson().fromJson(json, Applications.class);
    }
}
