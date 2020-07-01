package org.chums.checkin.helpers;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;

import javax.net.ssl.HttpsURLConnection;

public class Json {
    private static String readAll(Reader rd) throws IOException {
        StringBuilder sb = new StringBuilder();
        int cp;
        while ((cp = rd.read()) != -1) sb.append((char) cp);
        return sb.toString();
    }

    public static String get(String url) throws IOException, JSONException {
        try {
            URL urlObj = new URL(url);
            URLConnection conn = urlObj.openConnection();
            conn.setRequestProperty("Authorization", "Bearer " + CachedData.ApiKey);
            conn.setRequestProperty("content-type", "application/json");

            InputStream is = conn.getInputStream();

            try {
                BufferedReader rd = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
                String jsonText = readAll(rd);
                return jsonText;
            } finally {
                is.close();

            }
        } catch (Exception ex)
        {
            return null;
        }
    }

    public static String post(String url, String jsonData) throws IOException, JSONException {
        try {


            URL urlObj = new URL(url);
            HttpsURLConnection conn = (HttpsURLConnection) urlObj.openConnection();
            conn.setRequestMethod("POST");

            if (!url.contains("/login")) conn.setRequestProperty("Authorization", "Bearer " + CachedData.ApiKey);

            conn.setRequestProperty("content-type", "application/json");
            conn.setDoOutput(true);
            DataOutputStream wr = new DataOutputStream(conn.getOutputStream());
            wr.writeBytes(jsonData);
            wr.flush();
            wr.close();


            InputStream is = conn.getInputStream();

            try {
                BufferedReader rd = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
                String jsonText = readAll(rd);
                return jsonText;
            } finally {
                is.close();

            }
        } catch (Exception ex)
        {
            return null;
        }
    }
}
