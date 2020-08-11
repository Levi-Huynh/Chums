package org.chums.checkin.activities;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.os.Bundle;
import android.os.Handler;
import android.support.constraint.ConstraintLayout;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;
import android.widget.TextView;

import org.chums.checkin.R;
import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.PrintHandHelper;
import org.chums.checkin.models.Person;
import org.chums.checkin.models.Visit;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class PrintActivity extends AppCompatActivity {
    private WebView webView;
    PrintHandHelper phh = new PrintHandHelper(null);
    List<Bitmap> bitmaps = null;
    int visitIndex = 0;
    TextView printStatus;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_print);
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
/*
    private void attachPrintHand()
    {
        printStatus.setText("Preparing Printer...");
        phh.attach(PrintActivity.this   );
        waitTillReady();
    }

    private void waitForSdk()
    {
        printStatus.setText("Finding Printer...");
        if (!phh.isInitialized) {
            phh.initSdk(this);
            final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    waitForSdk();
                }
            }, 1000);
        } else attachPrintHand();
    }*/


    public void onResume() {
        super.onResume();
        printStatus =  (TextView)this.findViewById(R.id.printStatus);
        if (this.phh.isReady()) startProcess(); else nextScreen();
    }

    private void startProcess()
    {
        printStatus.setText("Printing to " + PrintHandHelper.PrinterName);
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() { nextScreen(); }
        }, 10000);
        populateBitmaps();
    }



    private void nextScreen()
    {
        Intent browser = new Intent(PrintActivity.this, LookupActivity.class);
        browser.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        startActivity(browser);
    }

    private void populateBitmaps()
    {
        bitmaps = new ArrayList<Bitmap>();
        visitIndex = 0;
        if (CachedData.PendingVisits.size()>0) prepareBitmap();
    }



    private void prepareBitmap() {
        webView = (WebView) findViewById(R.id.webBrowser);
        webView.getSettings().setLoadWithOverviewMode(true);
        webView.getSettings().setUseWideViewPort(true);

        //RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(PrintHandHelper.BitmapWidth, PrintHandHelper.BitmapHeight);
        ConstraintLayout.LayoutParams params = new ConstraintLayout.LayoutParams(PrintHandHelper.BitmapWidth, PrintHandHelper.BitmapHeight);
        //params. .addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
        webView.setLayoutParams(params);


        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                final Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        bitmaps.add(getBitmap());
                        showPrintPreview();
                        visitIndex++;
                        if (visitIndex<CachedData.PendingVisits.size()) prepareBitmap();
                        else print();
                    }
                }, 1000);
            }
        });
        String htmlDocument = replaceValues(readHtml("1_1x3_5.html"));
        webView.loadDataWithBaseURL(null, htmlDocument, "text/HTML", "UTF-8", null);
    }

    private String replaceValues(String html)
    {
        Visit v = CachedData.PendingVisits.get(visitIndex);
        Person p = CachedData.HouseholdMembers.getByPersonId(v.getPersonId()).getPerson();

        String result = html;

        result = result.replace("[Name]", p.getDisplayName());
        result = result.replace("[Sessions]", v.getVisitSessions().getDisplayText());

        return result;
    }


    public String readHtml(String inFile) {
        String contents = "";
        try {
            InputStream stream = getAssets().open(inFile);
            int size = stream.available();
            byte[] buffer = new byte[size];
            stream.read(buffer);
            stream.close();
            contents = new String(buffer);
        } catch (IOException e) { }
        return contents;
    }


    private void showPrintPreview()
    {
        ImageView printPreview = (ImageView)findViewById(R.id.printPreview);
        printPreview.setImageBitmap(bitmaps.get(bitmaps.size()-1));
    }

    private void print()
    {
        phh.print(bitmaps, this);
        phh.detach();
    }

    private Bitmap getBitmap()
    {
        Bitmap bitmap = Bitmap.createBitmap(PrintHandHelper.BitmapWidth, PrintHandHelper.BitmapHeight, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        webView.draw(canvas);
        return bitmap;
    }



}
