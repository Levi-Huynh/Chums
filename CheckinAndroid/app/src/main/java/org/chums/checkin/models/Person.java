package org.chums.checkin.models;

import java.util.Date;



public class Person {
    private int id;
    private int householdId;
    private Name name;

    private String photo;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Name getName() {  return name;  }

    public void setName(Name name) {  this.name = name; }

    public int getHouseholdId() { return householdId; }

    public void setHouseholdId(int householdId) { this.householdId = householdId; }
}
