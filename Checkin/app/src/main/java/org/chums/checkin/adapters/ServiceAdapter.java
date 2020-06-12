package org.chums.checkin.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import org.chums.checkin.R;
import org.chums.checkin.models.People;
import org.chums.checkin.models.Person;
import org.chums.checkin.models.Service;
import org.chums.checkin.models.Services;

public class ServiceAdapter extends ArrayAdapter<Service> {
    private final Context context;
    private final Services services;

    public ServiceAdapter(Context context, Services services) {
        super(context, -1, services);
        this.context = context;
        this.services = services;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View rowView = inflater.inflate(R.layout.list_service, parent, false);
        TextView textView = (TextView) rowView.findViewById(R.id.personName);
        textView.setText(services.get(position).Name);
        return rowView;
    }
}