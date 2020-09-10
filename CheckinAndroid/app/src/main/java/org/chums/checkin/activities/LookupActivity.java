package org.chums.checkin.activities;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import org.chums.checkin.R;
import org.chums.checkin.adapters.PersonAdapter;
import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.models.People;
import org.chums.checkin.models.Visits;

public class LookupActivity  extends AppCompatActivity {

    String phoneNumber;
    People people;





    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lookup);
        goFullScreen();
    }



    public void onResume() {
        super.onResume();
        final Button searchButton = (Button) findViewById(R.id.searchButton);
        final EditText phoneText = (EditText) findViewById(R.id.phoneText);
        ListView peopleList = (ListView) findViewById(R.id.peopleList);

        phoneText.setText("");
        peopleList.setAdapter(null);


        phoneText.setOnEditorActionListener(new EditText.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if(actionId== EditorInfo.IME_ACTION_DONE){
                    searchButton.callOnClick();
                }
                return false;
            }
        });



        phoneText.requestFocus();
        //InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        //imm.showSoftInput(phoneText, InputMethodManager.SHOW_IMPLICIT);


        searchButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                EditText phoneText = (EditText) findViewById(R.id.phoneText);
                phoneNumber = phoneText.getText().toString();

                if (phoneNumber.isEmpty() || phoneNumber.equals(null))
                    Toast.makeText(LookupActivity.this, "Please enter a phone number", Toast.LENGTH_LONG).show();
                else search(phoneNumber);
            }
        });

        peopleList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                CachedData.SelectedHouseholdId = people.get(position).getHouseholdId();
                CachedData.PendingVisits = new Visits();

                Thread thread = new Thread(new Runnable() {
                    @Override
                    public void run() {
                        CachedData.HouseholdMembers = People.loadForHousehold(CachedData.SelectedHouseholdId);
                        if (CachedData.HouseholdMembers.size()>0) {
                            CachedData.LoadedVisits = Visits.loadForServiceHousehold(CachedData.ServiceId, CachedData.HouseholdMembers.get(0).getHouseholdId());
                            CachedData.PendingVisits = CachedData.LoadedVisits;
                        }

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                nextScreen();
                            }
                        });
                    }
                });
                thread.start();


            }
        });
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

    private void search(final String phoneNumber)
    {
        //doWebViewPrint();

        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                people = People.searchPhone(phoneNumber);
                runOnUiThread(new Runnable() {
                    public void run() {
                        ListView peopleList = (ListView) findViewById(R.id.peopleList);
                        final PersonAdapter adapter = new PersonAdapter(LookupActivity.this, people);
                        peopleList.setAdapter(adapter);
                    }
                });

            }
        });
        thread.start();
    }

    private void nextScreen()
    {
        Intent browser = new Intent(LookupActivity.this, HouseholdActivity.class);
        browser.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        startActivity(browser);
    }


}
