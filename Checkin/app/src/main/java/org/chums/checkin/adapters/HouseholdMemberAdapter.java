package org.chums.checkin.adapters;

import android.app.Activity;
import android.content.Context;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.Button;
import android.widget.ExpandableListView;
import android.widget.TextView;

import org.chums.checkin.R;
import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.models.HouseholdMember;
import org.chums.checkin.models.HouseholdMembers;
import org.chums.checkin.models.ServiceTime;
import org.chums.checkin.models.Visit;
import org.chums.checkin.models.VisitSession;
import org.chums.checkin.models.VisitSessions;


public class HouseholdMemberAdapter extends BaseExpandableListAdapter {
    private final Context context;
    private final HouseholdMembers members;


    public HouseholdMemberAdapter(Context context, HouseholdMembers members) {
        //super(context, -1, members);
        this.context = context;
        this.members = members;
    }

    @Override
    public Object getChild(int memberPosition, int serivceTimePosititon) {
        return CachedData.ServiceTimes.get(serivceTimePosititon);
    }

    @Override
    public long getChildId(int memberPosition, int serviceTimePosition) {
        return serviceTimePosition;
    }

    @Override
    public View getChildView(int groupPosition, final int childPosition, boolean isLastChild, View convertView, ViewGroup parent) {
        LayoutInflater infalInflater = (LayoutInflater) this.context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        convertView = infalInflater.inflate(R.layout.list_servicetime, null);
        final ServiceTime serviceTime = (ServiceTime) getChild(groupPosition, childPosition);
        TextView serviceTimeName = (TextView) convertView.findViewById(R.id.serviceTimeName);
        Button groupButton = (Button) convertView.findViewById(R.id.groupButton);

        Visit v = CachedData.PendingVisits.getByPersonId(members.get(groupPosition).Person.Id);
        VisitSessions sessions = new VisitSessions();
        if (v!=null) sessions = v.VisitSessions.getByServiceTimeId(serviceTime.Id);


        groupButton.setTag(serviceTime.Id);
        convertView.setTag(members.get(groupPosition).Person.Id);
        groupButton.setBackgroundColor(context.getResources().getColor(R.color.buttonBackground));

        serviceTimeName.setText(serviceTime.Name);
        if (sessions.size()==0) groupButton.setText("None");
        else {
            groupButton.setText(serviceTime.Groups.getById(sessions.get(0).Session.GroupId).Name);

            Visit existingVisit = CachedData.LoadedVisits.getByPersonId(v.PersonId);
            if (existingVisit!=null) {
                VisitSessions existingSessions = existingVisit.VisitSessions.getByServiceTimeId(serviceTime.Id);
                if (existingSessions.size() > 0) {
                    if (existingSessions.get(0).Session.GroupId==sessions.get(0).Session.GroupId) groupButton.setBackgroundColor(context.getResources().getColor(R.color.green));
                }
            }

        }
        //groupButton.setOnClickListener(groupButtonClickHandler);

        return convertView;
    }



    @Override
    public int getChildrenCount(int groupPosition) {
        return CachedData.ServiceTimes.size();
    }


    @Override
    public Object getGroup(int memberPosition) {
        return this.members.get(memberPosition);
    }

    @Override
    public int getGroupCount() {
        return this.members.size();
    }

    @Override
    public long getGroupId(int groupPosition) {
        return groupPosition;
    }

    @Override
    public View getGroupView(int position, boolean isExpanded, View convertView, ViewGroup parent) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View rowView = inflater.inflate(R.layout.list_householdmember, parent, false);
        TextView personName = (TextView) rowView.findViewById(R.id.personName);
        TextView selectedGroups = (TextView) rowView.findViewById(R.id.selectedGroups);
        ViewGroup.LayoutParams params = rowView.getLayoutParams();

        if (CachedData.CheckinPersonId==members.get(position).Person.Id) ((ExpandableListView)parent).expandGroup(position);

        personName.setText(members.get(position).Person.DisplayName);
        if (isExpanded)
        {
            selectedGroups.setVisibility(View.INVISIBLE);
            params.height=(int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 70, context.getResources().getDisplayMetrics());
        } else
        {
            selectedGroups.setVisibility(View.VISIBLE);
            params.height=(int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 90, context.getResources().getDisplayMetrics());
        }
        rowView.setLayoutParams(params);

        selectedGroups.setText("none");
        selectedGroups.setTextColor(context.getResources().getColor(R.color.label));



        Visit v = CachedData.PendingVisits.getByPersonId(members.get(position).Person.Id);
        if (v!=null && v.VisitSessions.size()>0) {
            String displayText = v.VisitSessions.getDisplayText();
            selectedGroups.setText(displayText);

            Visit existingVisit = CachedData.LoadedVisits.getByPersonId(v.PersonId);
            if (existingVisit!=null)
            {
                String existingText = existingVisit.VisitSessions.getDisplayText();
                if (displayText.equals(existingText)) selectedGroups.setTextColor(context.getResources().getColor(R.color.green));
            }

        }



        return rowView;
    }


    @Override
    public boolean hasStableIds() {
        return false;
    }

    @Override
    public boolean isChildSelectable(int groupPosition, int childPosition) {
        return true;
    }

}