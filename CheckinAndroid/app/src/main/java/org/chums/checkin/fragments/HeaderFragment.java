package org.chums.checkin.fragments;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import org.chums.checkin.R;
import org.chums.checkin.activities.LookupActivity;
import org.chums.checkin.helpers.PrintHandHelper;
import org.chums.checkin.helpers.PrinterHelper;

public class HeaderFragment extends Fragment {
    static View v;
    TextView statusMessage;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_header, container, false);
        v = view;
        statusMessage = v.findViewById(R.id.statusMessage);
        statusMessage.setOnClickListener(new View.OnClickListener() { @Override public void onClick(View view) { PrinterHelper.configure(); } });

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


        //PrintHandHelper.PrinterStatus;
        /*
        if (context instanceof OnItemSelectedListener) {
            listener = (OnItemSelectedListener) context;
        } else {
            throw new ClassCastException(context.toString()
                    + " must implemenet MyListFragment.OnItemSelectedListener");
        }*/
    }

    @Override
    public void onDetach() {
        super.onDetach();
        //listener = null;
    }

}
