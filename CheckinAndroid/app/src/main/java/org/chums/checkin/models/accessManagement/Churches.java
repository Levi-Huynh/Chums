package org.chums.checkin.models.accessManagement;
import com.google.gson.Gson;
import java.util.ArrayList;

public class Churches extends ArrayList<Church> {

    public static Churches inflate(String json)
    {
        return new Gson().fromJson(json, Churches.class);
    }
}
