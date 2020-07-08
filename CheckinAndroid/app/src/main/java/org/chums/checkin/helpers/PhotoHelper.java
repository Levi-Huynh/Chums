package org.chums.checkin.helpers;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.widget.ImageView;

import org.chums.checkin.activities.LookupActivity;
import org.chums.checkin.models.Person;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;

public class PhotoHelper {

    private static String cacheDir="";

    public static void init(Activity activity)
    {
        cacheDir = activity.getCacheDir().getAbsolutePath();
    }

    public static void populateImage(final Activity activity, ImageView imgView, final Person person)
    {
        if (cacheDir=="") init(activity);
        final String url = CachedData.ContentBaseUrl + person.getPhoto();

        class OneShotTask implements Runnable {
            ImageView imgView;
            String url;
            OneShotTask(ImageView i, String u) { imgView = i; url=u; }
            public void run() {  populateImageInternal(activity, imgView, url);  }
        }
        Thread t = new Thread(new OneShotTask(imgView, url));
        t.start();
    }

    //The photo url changes whenever a new image is uploading so caching indefinitely isn't a problem.
    private static String getFileName(String url)
    {
        String[] parts = url.split("/");
        parts = parts[parts.length-1].split("\\?");
        String result = parts[0];
        if (parts.length>1)
        {
            String[] fileExt = parts[0].split("\\.");
            String file = fileExt[0];
            String ext = fileExt[1];

            String qs = parts[1].replace('=','_').replace('&','-');
            result = file + "." + qs + ext;
        }
        return cacheDir + result;
    }

    private static void populateImageInternal(final Activity activity, final ImageView imgView, final String url)
    {
        final String fileName = getFileName(url);
        File cachedFile = new File(fileName);

        final Bitmap bmp = (cachedFile.exists()) ? GetBitmapFromDisk(cachedFile) : GetBitmapFromUrl(url, cachedFile);
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {  imgView.setImageBitmap(bmp);  }
        });

    }

    private static Bitmap GetBitmapFromDisk(File file)
    {
        Bitmap image = null;
        try {
            image = BitmapFactory.decodeFile(file.getAbsolutePath());
        } catch(Exception e) {
            System.out.println(e);
        }
        return image;
    }

    private static Bitmap GetBitmapFromUrl(String url, File cacheFile)
    {
        Bitmap image = null;
        try {
            URL uri = new URL(url);
            image = BitmapFactory.decodeStream(uri.openConnection().getInputStream());
            SaveBitmap(image, cacheFile);

        } catch(IOException e) {
            System.out.println(e);
        }
        return image;
    }

    private static void SaveBitmap(Bitmap image, File cacheFile)
    {
        try (FileOutputStream out = new FileOutputStream(cacheFile.getAbsolutePath())) {
            image.compress(Bitmap.CompressFormat.PNG, 100, out);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
