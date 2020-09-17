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
            if (vs.getSession().getServiceTimeId() ==serviceTimeId) this.remove(vs);
        }

        //set the new one;
        VisitSession vs = new VisitSession();
        vs.setSession(new Session());
        vs.getSession().setServiceTimeId(serviceTimeId);
        vs.getSession().setGroupId(groupId);
        this.add(vs);
    }

    public String getDisplayText()
    {
        ArrayList<String> names = new ArrayList<String>();
        for (VisitSession vs : this) names.add(vs.getDisplayText());
        return names.stream().collect(Collectors.joining(", "));
    }

    public String getPickupText()
    {
        ArrayList<String> names = new ArrayList<String>();
        for (VisitSession vs : this) {
            String text = vs.getPickupText();
            if (text!="") names.add(text);
        }
        return names.stream().collect(Collectors.joining(", "));
    }

    public VisitSessions getByServiceTimeId(int serviceTimeId)
    {
        VisitSessions result = new VisitSessions();
        for (VisitSession vs : this) if (vs.getSession().getServiceTimeId() ==serviceTimeId) result.add(vs);
        return result;
    }

}
