package org.chums.checkin.models;

import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.Json;

public class ErrorLog {
    private String application;
    private String level;
    private String message;
    private String additionalDetails;

    public String getApplication() {
        return application;
    }

    public void setApplication(String application) {
        this.application = application;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getAdditionalDetails() {
        return additionalDetails;
    }

    public void setAdditionalDetails(String additionalDetails) {
        this.additionalDetails = additionalDetails;
    }


    public ErrorLog() {}

    public ErrorLog(String level, String message) {
        this.application = "Checkin";
        this.level = level;
        this.message = message;
        this.additionalDetails = "ServiceId: " + CachedData.ServiceId;
    }

}
