package org.chums.checkin.models;

import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Collections;

public class Groups  extends ArrayList<Group> {

    public static Groups inflate(String json)
    {
        return new Gson().fromJson(json, Groups.class);
    }

    public ArrayList<String> getCategories()
    {
        ArrayList<String> result = new ArrayList<String>();
        for (Group g : this)
        {
            if (!result.contains(g.getCategoryName())) result.add(g.getCategoryName());
        }
        Collections.sort(result);
        return result;
    }

    public Groups getByCategoryName(String categoryName)
    {
        Groups result = new Groups();
        for (Group g : this) if (g.getCategoryName() ==categoryName) result.add(g);
        return result;
    }

    public Group getById(int id)
    {
        Group result = null;
        for (Group g : this) if (g.getId() ==id) result = g;
        return result;
    }

/*
    public static Groups loadForServiceIds(int serviceId)
    {
        Groups result = null;
        String url = CachedData.ApiRoot + "/groups?serviceId=" + Integer.toString(serviceId);
        try {
            String jsonResponse = Json.get(url);
            result = inflate(jsonResponse);
        } catch (Exception ex) {
            int a=0;
        }
        return result;
    }*/

}
