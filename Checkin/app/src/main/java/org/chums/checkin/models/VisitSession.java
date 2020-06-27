package org.chums.checkin.models;

import org.chums.checkin.helpers.CachedData;

public class VisitSession {
    private Session session;

    public String getDisplayText()
    {
        ServiceTime st = CachedData.ServiceTimes.getById(getSession().getServiceTimeId());
        return st.getName() + " - " + st.getGroups().getById(getSession().getGroupId()).getName();
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }
}
