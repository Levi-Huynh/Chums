package org.chums.checkin.activities;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import org.chums.checkin.R;
import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.PrintHandHelper;
import org.chums.checkin.models.Visit;
import org.chums.checkin.models.VisitSessions;

public class PrinterActivity extends AppCompatActivity {

    TextView printerStatus;
    PrintHandHelper phh = new PrintHandHelper();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_printer);
        goFullScreen();
    }

    public void onResume() {
        super.onResume();
        printerStatus =  (TextView)this.findViewById(R.id.printerStatus);
        phh.initSdk(this);
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() { waitForSdk(); }
        }, 1000);

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

    private void waitForSdk()
    {
        if (!phh.isInitialized) {
            final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() { waitForSdk(); }
            }, 1000);
        } else {
            runOnUiThread(new Runnable() {
                @Override
                public void run() { attachToPrinter(); }
            });

        }

    }

    private void waitTillReady()
    {
        if (!phh.isReady()) {
            final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {  waitTillReady();  }
            }, 1000);

        } else {
            phh.detach();
            runOnUiThread(new Runnable() {
                @Override
                public void run() { nextScreen(); }
            });
        }
    }


    private void attachToPrinter()
    {
        printerStatus.setText("Detecting Printer...");
        phh.attach(PrinterActivity.this, PrinterActivity.this   );
        waitTillReady();
    }

    private void nextScreen()
    {
        Intent browser = new Intent(PrinterActivity.this, LoginActivity.class);
        //browser.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        startActivity(browser);
    }

}
