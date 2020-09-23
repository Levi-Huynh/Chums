package org.chums.checkin.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import org.chums.checkin.R;
import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.models.accessManagement.LoginRequest;
import org.chums.checkin.models.accessManagement.LoginResponse;
import org.chums.checkin.models.accessManagement.User;

public class LoginActivity extends AppCompatActivity {

    SharedPreferences pref;
    SharedPreferences.Editor editor;
    EditText emailText;
    EditText passwordText;
    String email;
    String password;
    static boolean initialLoad=true;

    private void initEnvironment()
    {
        CachedData.IsProd = true;

        if (!CachedData.IsProd)
        {
            CachedData.AccessManagementApiRoot = "https://api.staging.livecs.org";
            CachedData.ApiRoot = "https://api.staging.chums.org";
            CachedData.ContentBaseUrl = "https://app.staging.chums.org";
        }
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        initEnvironment();
        setContentView(R.layout.activity_login);
    }

    @Override
    public void onResume() {
        super.onResume();
        pref = getSharedPreferences("Appdata", MODE_PRIVATE);
        Button send = (Button) findViewById(R.id.sendButton);
        emailText = (EditText) findViewById(R.id.emailText);
        passwordText = (EditText) findViewById(R.id.passwordText);

        emailText.setText(pref.getString("email", ""));
        passwordText.setText(pref.getString("password", ""));




        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                email = emailText.getText().toString();
                password = passwordText.getText().toString();

                if (email.isEmpty() || email.equals(null))
                    Toast.makeText(LoginActivity.this, "Please enter your email address", Toast.LENGTH_LONG).show();
                else if (password.isEmpty() || password.equals(null))
                    Toast.makeText(LoginActivity.this, "Please enter your password", Toast.LENGTH_LONG).show();
                else login();
            }
        });

        if (initialLoad) {
            if (!pref.getString("password", "").equals("")) login();
            initialLoad = false;
        }

    }


    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);

        // Trigger the initial hide() shortly after the activity has been
        // created, to briefly hint to the user that UI controls
        // are available.
        goFullScreen();
    }

    private void goFullScreen()
    {
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.hide();
        }

        View mContentView = findViewById(R.id.fullscreen_content);

        mContentView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LOW_PROFILE
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION);


        mContentView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                goFullScreen();
            }
        });
    }

    private void login()
    {
        email = emailText.getText().toString();
        password = passwordText.getText().toString();


        editor = pref.edit();
        editor.putString("email", email);
        editor.putString("password", password);
        editor.commit();
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                LoginResponse resp = LoginRequest.login(email, password);
                if (resp!=null && resp.getToken()!=null) {
                    CachedData.ApiKey = resp.getToken();
                    nextScreen();
                }
            }
        });
        thread.start();
    }

    private void nextScreen()
    {
        Intent browser = new Intent(LoginActivity.this, ServicesActivity.class);
        browser.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        startActivity(browser);
    }


}
