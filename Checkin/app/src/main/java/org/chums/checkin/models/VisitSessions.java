package org.chums.checkin.models;

import java.util.ArrayList;
import java.util.stream.Collectors;

public class VisitSessions extends ArrayList<VisitSession> {

    public void setValue(int serviceTimeId, int groupId)
    {
        //remove the old value
        for (int i=this.size() - 1; i>=0; i--)
        {
            VisitSession vs = this.get(i);
            if (vs.Session.ServiceTimeId==serviceTimeId) this.remove(vs);
        }

        //set the new one;
        VisitSession vs = new VisitSession();
        vs.Session = new Session();
        vs.Session.ServiceTimeId=serviceTimeId;
        vs.Session.GroupId=groupId;
        this.add(vs);
    }

    public String getDisplayText()
    {
        ArrayList<String> names = new ArrayList<String>();
        for (VisitSession vs : this) names.add(vs.getDisplayText());
        return names.stream().collect(Collectors.joining(", "));
    }

    public VisitSessions getByServiceTimeId(int serviceTimeId)
    {
        VisitSessions result = new VisitSessions();
        for (VisitSession vs : this) if (vs.Session.ServiceTimeId==serviceTimeId) result.add(vs);
        return result;
    }

}
