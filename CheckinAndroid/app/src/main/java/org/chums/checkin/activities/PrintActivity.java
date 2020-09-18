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
import org.chums.checkin.helpers.PrinterHelper;
import org.chums.checkin.models.Person;
import org.chums.checkin.models.Visit;
import org.chums.checkin.models.Visits;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class PrintActivity extends AppCompatActivity {
    private WebView webView;
    PrintHandHelper phh = new PrintHandHelper(null);
    List<Bitmap> bitmaps = null;
    int visitIndex = 0;
    TextView printStatus;
    boolean pickupSlipPending=false;
    String pickupCode="";
    Visits childVisits=null;

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


    public void onResume() {
        super.onResume();
        printStatus =  (TextView)this.findViewById(R.id.printStatus);
        //if (this.phh.isReady()) startProcess(); else nextScreen();
        startProcess();
    }

    private void startProcess()
    {
        if (PrinterHelper.readyToPrint) {
            printStatus.setText("Printing to " + PrintHandHelper.PrinterName);
            final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    nextScreen();
                }
            }, 10000);
            populateBitmaps();
        } else {
            printStatus.setText("Checkin complete.");
        }
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
        if (CachedData.PendingVisits.size()>0) {
            childVisits = CachedData.PendingVisits.getWithParentPickup();
            if (childVisits.size()>0) {
                generatePickupCode();
                pickupSlipPending=true;
            }
            prepareBitmap("1_1x3_5.html");
        }
    }

    private void generatePickupCode()
    {
        //Omitted vowels and numbers that are substituted for vowels to avoid bad words from being formed
        char[] characters = {'2', '3', '4', '5', '6', '7', '8', '9', 'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'};
        this.pickupCode="";
        Random rnd = new Random();
        for (int i=0; i<4; i++)
        {
            int idx = rnd.nextInt(characters.length);
            this.pickupCode+=characters[idx];
        }
    }



    private void prepareBitmap(final String htmlFile) {
        webView = (WebView) findViewById(R.id.webBrowser);
        webView.getSettings().setLoadWithOverviewMode(true);
        webView.getSettings().setUseWideViewPort(true);

        ConstraintLayout.LayoutParams params = new ConstraintLayout.LayoutParams(PrintHandHelper.BitmapWidth, PrintHandHelper.BitmapHeight);
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
                        if (visitIndex<CachedData.PendingVisits.size()) prepareBitmap(htmlFile);
                        else if (pickupSlipPending) {
                            pickupSlipPending=false;
                            prepareBitmap("pickup_" + htmlFile);
                        }
                        else print();
                    }
                }, 1000);
            }
        });
        String template = readHtml(htmlFile);
        String htmlDocument = (visitIndex<CachedData.PendingVisits.size()) ? replaceValues(template) : replaceValuesPickup(template);
        webView.loadDataWithBaseURL(null, htmlDocument, "text/HTML", "UTF-8", null);
    }

    private String replaceValues(String html)
    {
        Visit v = CachedData.PendingVisits.get(visitIndex);
        Person p = CachedData.HouseholdMembers.getById(v.getPersonId());

        String result = html;
        result = result.replace("[Name]", p.getName().getDisplay());
        result = result.replace("[Sessions]", v.getVisitSessions().getDisplayText().replace(", ", "<br/>"));

        boolean isChild = childVisits.getByPersonId(p.getId()) != null;

        result = result.replace("[PickupCode]", (isChild) ? pickupCode : "");
        return result;
    }

    private String replaceValuesPickup(String html)
    {
        ArrayList<String> childList = new ArrayList<String>();
        for (Visit v : childVisits)
        {
            Person p = CachedData.HouseholdMembers.getById(v.getPersonId());
            childList.add(p.getName().getDisplay() + " - " + v.getVisitSessions().getPickupText());
        }

        String childBullets = "";
        for (String child : childList) childBullets = childBullets + "<li>" + child + "</li>";

        String result = html;
        result = result.replace("[Children]", childBullets);
        result = result.replace("[PickupCode]", this.pickupCode);
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
        //phh.detach();
    }

    private Bitmap getBitmap()
    {
        Bitmap bitmap = Bitmap.createBitmap(PrintHandHelper.BitmapWidth, PrintHandHelper.BitmapHeight, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        webView.draw(canvas);
        return bitmap;
    }



}
