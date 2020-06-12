package org.chums.checkin.adapters;

import android.app.Activity;
import android.content.Context;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.TextView;

import org.chums.checkin.R;
import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.models.Group;
import org.chums.checkin.models.Groups;
import org.chums.checkin.models.HouseholdMember;
import org.chums.checkin.models.HouseholdMembers;
import org.chums.checkin.models.ServiceTime;

import java.util.ArrayList;
import java.util.List;


public class GroupAdapter extends BaseExpandableListAdapter {
    private final Context context;
    private final List<String> categories;

    private Groups getGroups(int categoryPosition)
    {
        String categoryName =  this.categories.get(categoryPosition);
        return CachedData.ServiceTimes.getById(CachedData.ServiceTimeId).Groups.getByCategoryName(categoryName);
    }

    public GroupAdapter(Context context, List<String> categories) {
        //super(context, -1, members);
        this.context = context;
        this.categories = categories;
    }

    @Override
    public Object getChild(int categoryPosition, int groupPosititon) {

        return getGroups(categoryPosition).get(groupPosititon);
    }

    @Override
    public long getChildId(int categoryPosition, int groupPosititon) {
        return groupPosititon;
    }

    @Override
    public View getChildView(int categoryPosition, final int groupPosition, boolean isLastChild, View groupView, ViewGroup parent) {
        LayoutInflater infalInflater = (LayoutInflater) this.context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        groupView = infalInflater.inflate(R.layout.list_group, null);
        final Group group = (Group) getChild(categoryPosition, groupPosition);
        TextView groupName = (TextView) groupView.findViewById(R.id.groupName);
        groupName.setText(group.Name);
        groupName.setTag(group.Id);

        return groupView;
    }

    @Override
    public int getChildrenCount(int categoryPosition) {
        return getGroups(categoryPosition).size();
    }


    @Override
    public Object getGroup(int categoryPosition) { return this.categories.get(categoryPosition); }

    @Override
    public int getGroupCount() {
        return this.categories.size();
    }

    @Override
    public long getGroupId(int categoryPosition) {
        return categoryPosition;
    }

    @Override
    public View getGroupView(int position, boolean isExpanded, View convertView, ViewGroup parent) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View rowView = inflater.inflate(R.layout.list_groupcategory, parent, false);
        TextView groupCategoryName = (TextView) rowView.findViewById(R.id.groupCategoryName);
        groupCategoryName.setText(categories.get(position));
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