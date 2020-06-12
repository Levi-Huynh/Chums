package org.chums.checkin.models;

import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.models.Session;

public class VisitSession {
    public Session Session;

    public String getDisplayText()
    {
        ServiceTime st = CachedData.ServiceTimes.getById(Session.ServiceTimeId);
        return st.Name + " - " + st.Groups.getById(Session.GroupId).Name;
    }

}
