package org.chums.checkin.activities;

import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.ExpandableListView;

import org.chums.checkin.R;
import org.chums.checkin.adapters.GroupAdapter;
import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.models.Visit;
import org.chums.checkin.models.VisitSessions;

import java.util.List;

public class GroupActivity extends AppCompatActivity {
    ExpandableListView categoryList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_group);
        goFullScreen();
    }

    private void goFullScreen()
    {
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) actionBar.hide();
        View mContentView = findViewById(R.id.fullscreen_content);
        mContentView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LOW_PROFILE | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION  | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION);
        mContentView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {  goFullScreen();  }
        });
    }

    public void onResume() {
        super.onResume();

        Button noneButton=(Button)this.findViewById(R.id.noneButton);
        noneButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Visit visit = CachedData.PendingVisits.getByPersonId(CachedData.CheckinPersonId);
                VisitSessions sessions = visit.getVisitSessions().getByServiceTimeId(CachedData.ServiceTimeId);
                if (sessions.size()>0) visit.getVisitSessions().remove(sessions.get(0));
                finish();
            }
        });

        load();
    }

    private void load()
    {
        categoryList = (ExpandableListView) findViewById(R.id.categoryList);
        categoryList.setOnGroupExpandListener(new ExpandableListView.OnGroupExpandListener() {
            int previousGroup = -1;

            @Override
            public void onGroupExpand(int groupPosition) {
                if(groupPosition != previousGroup) categoryList.collapseGroup(previousGroup);
                previousGroup = groupPosition;
            }
        });

        List<String> categories = CachedData.ServiceTimes.getById(CachedData.ServiceTimeId).getGroups().getCategories();

        final GroupAdapter adapter = new GroupAdapter(GroupActivity.this, categories);
        categoryList.setAdapter(adapter);
    }


    public void groupNameClick(View v)
    {
        int groupId = (int)v.getTag();

        Visit visit = CachedData.PendingVisits.getByPersonId(CachedData.CheckinPersonId);
        if (visit==null) {
            visit=new Visit();
            visit.setPersonId(CachedData.CheckinPersonId);
            visit.setServiceId(CachedData.ServiceId);
            visit.setVisitSessions(new VisitSessions());
            CachedData.PendingVisits.add(visit);
        }

        visit.getVisitSessions().setValue(CachedData.ServiceTimeId, groupId);
        finish();



        //nextScreen();
    }

}
