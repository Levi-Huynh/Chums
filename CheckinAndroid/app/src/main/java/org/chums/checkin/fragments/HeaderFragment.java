package org.chums.checkin.fragments;

import android.content.Context;
import android.os.Bundle;
import android.os.PowerManager;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;


import org.chums.checkin.R;
import org.chums.checkin.activities.LookupActivity;
import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.PrintHandHelper;
import org.chums.checkin.helpers.PrinterHelper;

public class HeaderFragment extends Fragment {
    static View v;
    TextView statusMessage;
    static PowerManager.WakeLock  wakeLock = null;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_header, container, false);
        v = view;
        statusMessage = v.findViewById(R.id.statusMessage);
        statusMessage.setOnClickListener(new View.OnClickListener() { @Override public void onClick(View view) { PrinterHelper.configure(); } });

        if (!CachedData.IsProd) {
            ImageView logo = (ImageView) v.findViewById(R.id.logo);
            logo.setImageResource(R.drawable.logotest);
        }

        Runnable r = new Runnable() { @Override public void run() { updateStatus(); } };
        updateStatus();
        PrinterHelper.bind(getContext(), r);
        return view;
    }


    private void updateStatus()
    {
        statusMessage.setText(PrinterHelper.Status);
    }


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        final Context c = context;
        new android.os.Handler().postDelayed(new Runnable() {
                public void run() {
                if (wakeLock==null) {
                    PowerManager pm = (PowerManager) c.getSystemService(Context.POWER_SERVICE);
                    wakeLock = pm.newWakeLock((PowerManager.SCREEN_BRIGHT_WAKE_LOCK | PowerManager.FULL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP), "chums:wakeUp");
                    wakeLock.setReferenceCounted(false);
                    wakeLock.acquire();
                }
                }
            },
            5000
        );
    }

    @Override
    public void onDetach() {
        super.onDetach();
        //listener = null;
    }

}
