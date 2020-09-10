package org.chums.checkin.adapters;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.Image;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import org.chums.checkin.R;
import org.chums.checkin.activities.LookupActivity;
import org.chums.checkin.helpers.PhotoHelper;
import org.chums.checkin.models.People;
import org.chums.checkin.models.Person;

import java.io.IOException;
import java.net.URL;

public class PersonAdapter extends ArrayAdapter<Person> {
    private final Context context;
    private final People people;

    public PersonAdapter(Context context, People people) {
        super(context, -1, people);
        this.context = context;
        this.people = people;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View rowView = inflater.inflate(R.layout.list_person, parent, false);
        TextView textView = (TextView) rowView.findViewById(R.id.personName);
        ImageView imgView = (ImageView) rowView.findViewById(R.id.personPhoto);
        textView.setText(people.get(position).getName().getDisplay());

        PhotoHelper.populateImage((Activity)context, imgView, people.get(position));

        return rowView;
    }

}
