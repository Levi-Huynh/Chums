package org.chums.checkin.models;

public class Group {
    private int id;
    private String categoryName;
    private String name;
    public boolean parentPickup;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean getParentPickup() {
        return parentPickup;
    }

    public void setParentPickup(boolean parentPickup) {
        this.parentPickup = parentPickup;
    }
}
