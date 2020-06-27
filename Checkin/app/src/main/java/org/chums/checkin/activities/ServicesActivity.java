package org.chums.checkin.activities;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;

import org.chums.checkin.R;
import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.models.ServiceTimes;
import org.chums.checkin.models.Services;
import org.chums.checkin.adapters.ServiceAdapter;

public class ServicesActivity extends AppCompatActivity {
    private Services services;
    ListView serviceList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_services);
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
        load();
        serviceList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                CachedData.ServiceId = services.get(position).getId();
                loadServiceTimes();
                nextScreen();
            }
        });
    }

    private void loadServiceTimes()
    {
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() { CachedData.ServiceTimes = ServiceTimes.loadForServiceId(CachedData.ServiceId); }
        });
        thread.start();
    }

    private void load()
    {
        serviceList = (ListView) findViewById(R.id.serviceList);
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                services = Services.loadAll();
                runOnUiThread(new Runnable() {
                    public void run() {
                        final ServiceAdapter adapter = new ServiceAdapter(ServicesActivity.this, services);
                        serviceList.setAdapter(adapter);
                    }
                });

            }
        });
        thread.start();
    }

    private void nextScreen()
    {
        Intent browser = new Intent(ServicesActivity.this, LookupActivity.class);
        //browser.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        startActivity(browser);
    }

}
