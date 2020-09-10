package org.chums.checkin.models.accessManagement;

public class Church {
    private int id;
    private String name;
    private Applications apps;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Applications getApps() {
        return apps;
    }

    public void setApps(Applications apps) {
        this.apps = apps;
    }
}
