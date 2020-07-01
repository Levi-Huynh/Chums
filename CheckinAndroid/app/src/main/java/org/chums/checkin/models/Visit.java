package org.chums.checkin.models;

public class Visit {
    private int personId;
    private int serviceId;
    private VisitSessions visitSessions;

    public int getPersonId() {
        return personId;
    }

    public void setPersonId(int personId) {
        this.personId = personId;
    }

    public int getServiceId() {
        return serviceId;
    }

    public void setServiceId(int serviceId) {
        this.serviceId = serviceId;
    }

    public VisitSessions getVisitSessions() {
        return visitSessions;
    }

    public void setVisitSessions(VisitSessions visitSessions) {
        this.visitSessions = visitSessions;
    }
}
