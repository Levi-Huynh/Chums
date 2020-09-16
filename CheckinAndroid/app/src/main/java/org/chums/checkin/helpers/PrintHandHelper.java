package org.chums.checkin.helpers;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Environment;
import android.os.RemoteException;
import android.provider.MediaStore;
import android.webkit.WebView;
import android.widget.Toast;
import com.dynamixsoftware.intentapi.IJob;
import com.dynamixsoftware.intentapi.IPrintCallback;
import com.dynamixsoftware.intentapi.IPrinterInfo;
import com.dynamixsoftware.intentapi.IServiceCallback;
import com.dynamixsoftware.intentapi.IntentAPI;
import com.dynamixsoftware.intentapi.PrintHandOption;
import com.dynamixsoftware.intentapi.PrinterOption;
import com.dynamixsoftware.intentapi.PrinterOptionValue;
import com.dynamixsoftware.intentapi.Result;
import com.dynamixsoftware.printingsdk.ISetupPrinterListener;
import com.dynamixsoftware.printingsdk.PrintingSdk;
import com.dynamixsoftware.printingsdk.ResultType;


import org.chums.checkin.models.ErrorLogs;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.List;

public class PrintHandHelper {

    private static IntentAPI intentApi;
    static Boolean rotate=true;
    public static String PrinterName="";
    public static int PaperWidth=0;
    public static int PaperHeight=0;
    public static int BitmapWidth=0;
    public static int BitmapHeight=0;
    public static Boolean isInitialized=false;
    public static String Status="Pending init";

    private PrintingSdk printingSdk;
    private Context appContext;
    Runnable statusUpdatedRunnable;

    public void setPrinterStatus(String status)
    {
        PrintHandHelper.Status=status;
        //toastInMainThread(appContext, status);
        if (statusUpdatedRunnable != null) statusUpdatedRunnable.run();
    }

    public PrintHandHelper(Runnable r)
    {
        this.statusUpdatedRunnable = r;
    }



    public void attach(Context context)
    {
        intentApi = new IntentAPI(context);
        final Context appContext = context.getApplicationContext();
        try {
            intentApi.runService(new IServiceCallback.Stub() {
                @Override
                public void onServiceDisconnected() { setPrinterStatus("Service disconnected."); }

                @Override
                public void onServiceConnected() {
                    setPrinterStatus("Attach - Service connected.");
                    setPaperSize();
                }

                @Override
                public void onFileOpen(int progress, int finished) { setPrinterStatus("onFileOpen progress " + progress + "; finished " + (finished == 1)); }

                @Override
                public void onLibraryDownload(int progress) {  setPrinterStatus("onLibraryDownload progress " + progress);  }

                @Override
                public boolean onRenderLibraryCheck(boolean renderLibrary, boolean fontLibrary) {
                    setPrinterStatus("onRenderLibraryCheck render library " + renderLibrary + "; fonts library " + fontLibrary);
                    return true;
                }

                @Override
                public String onPasswordRequired() {
                    setPrinterStatus("onPasswordRequired");
                    return "password";
                }

                @Override
                public void onError(Result result) {
                    setPrinterStatus("error, Result " + result + "; Result type " + result.getType());
                }
            });
            Boolean isRunning = intentApi.isServiceRunning();
        } catch (RemoteException e) {
            ErrorLogs.error(e);
            //e.printStackTrace();
        }
        try {
            intentApi.setPrintCallback(new IPrintCallback.Stub() {
                @Override
                public void startingPrintJob() {  setPrinterStatus("startingPrintJob"); }

                @Override
                public void start() {  setPrinterStatus("start"); }

                @Override
                public void sendingPage(int pageNum, int progress) { setPrinterStatus("sendingPage number " + pageNum + ", progress " + progress); }

                @Override
                public void preparePage(int pageNum) { setPrinterStatus("preparePage number " + pageNum); }

                @Override
                public boolean needCancel() {  setPrinterStatus("needCancel"); return false; }

                @Override
                public void finishingPrintJob() { setPrinterStatus("finishingPrintJob"); }

                @Override
                public void finish(Result result, int pagesPrinted) { setPrinterStatus("finish, Result " + result + "; Result type " + result.getType() + "; Result message " + result.getType().getMessage() + "; pages printed " + pagesPrinted); }
            });
        } catch (RemoteException e) {
            e.printStackTrace();
        }

    }

    private void toastInMainThread(final Context appContext, final String message) {
//        mainHandler.post(new Runnable() {
//            @Override
//            public void run() {
//                Toast.makeText(appContext, message, Toast.LENGTH_SHORT).show();
//            }
//        });
    }

    public void simplePrint()
    {
        //intentApi.print("PrintingSample", "image/png", Uri.parse("file://" + FilesUtils.getFilePath(requireContext(), FilesUtils.FILE_PNG)));
    }

    /*
    public void printWebView(final WebView webView)
    {
        try {
            IJob.Stub job = new IJob.Stub() {
                @Override
                public int getTotalPages() {
                    return 1;
                }

                @Override
                public Bitmap renderPageFragment(int num, Rect fragment) throws RemoteException {
                    return getWebViewBitmap(webView, PaperWidth, PaperHeight);
                }
            };
            Boolean premium = intentApi.checkPremium();
            intentApi.print(job, 1);
        } catch (RemoteException ex)
        {
            ErrorLogs.error(ex);
        }
    }*/
/*
    public void print(final Bitmap bitmap)
    {
        try {
            IJob.Stub job = new IJob.Stub() {
                @Override
                public int getTotalPages() {
                    return 1;
                }
                @Override
                public Bitmap renderPageFragment(int num, Rect fragment) throws RemoteException {
                    if (!rotate) return bitmap;
                    else {
                        int x = fragment.centerX()-(bitmap.getHeight()/2);
                        int y = fragment.centerY()-(bitmap.getWidth()/2);
                        Matrix matrix = new Matrix();
                        matrix.postRotate(90);
                        Bitmap result = Bitmap.createBitmap(bitmap, x, y, bitmap.getWidth(), bitmap.getHeight(), matrix, true);
                        return result;
                    }
                }
            };
            intentApi.print(job, 1);
        } catch (RemoteException ex)
        {
            ErrorLogs.error(ex);
        }
    }*/

    public Uri getImageUri(Context inContext, Bitmap inImage) {
        try {
            //File tempDir = inContext.getCacheDir();
            File tempDir = inContext.getExternalCacheDir();
            //File tempDir = Environment.getExternalStorageDirectory();
            tempDir = new File(tempDir.getAbsolutePath() + "/.temp/");
            tempDir.mkdir();
            File tempFile = File.createTempFile("image1", ".jpg", tempDir);
            //File tempFile = File.createTempFile("image1", ".jpg");
            ByteArrayOutputStream bytes = new ByteArrayOutputStream();
            inImage.compress(Bitmap.CompressFormat.JPEG, 100, bytes);
            byte[] bitmapData = bytes.toByteArray();

            //write the bytes in file
            FileOutputStream fos = new FileOutputStream(tempFile);
            fos.write(bitmapData);
            fos.flush();
            fos.close();
            return Uri.fromFile(tempFile);
        } catch (Exception ex)
        {
            return null;
        }
    }


    private void initRecent()
    {
        try {
            printingSdk.initRecentPrinters(new ISetupPrinterListener.Stub() {
                @Override
                public void start() {
                    toastInMainThread(appContext, "ISetupPrinterListener start");
                }

                @Override
                public void libraryPackInstallationProcess(int arg0) {
                    toastInMainThread(appContext, "ISetupPrinterListener libraryPackInstallationProcess " + arg0 + " %");
                }

                @Override
                public void finish(com.dynamixsoftware.printingsdk.Result arg0) {
                    isInitialized=true;
                    setPrinterStatus("Initialized");
                    //toastInMainThread(appContext, "ISetupPrinterListener finish " + arg0.name());
                    if (arg0.getType().equals(ResultType.ERROR_LIBRARY_PACK_NOT_INSTALLED)) {
                        setPrinterStatus("PrintHand not installed.");
                        // printingSdk.setup should be called with forceInstall = true to download required drivers
                    }
                }
            });
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }

    public void initSdk(final Context context)
    {
        printingSdk = new PrintingSdk(context);
        appContext = context.getApplicationContext();

        printingSdk.startService(new com.dynamixsoftware.printingsdk.IServiceCallback() {
            @Override
            public void onServiceConnected() {
                initRecent();
                Toast.makeText(context.getApplicationContext(), "Service connected", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onServiceDisconnected() {
                isInitialized=false;
                Toast.makeText(context.getApplicationContext(), "Service disconnected", Toast.LENGTH_SHORT).show();
            }
        });
    }

    public void print(final List<Bitmap> bitmaps, Context context)
    {
        Uri uri = getImageUri(context, bitmaps.get(0));
        try {
            intentApi.print("label 1", "image/jpg", uri);
        } catch (Exception ex)
        {
            ErrorLogs.error(ex);
        }
    }

    public void print2(final List<Bitmap> bitmaps, Context context)
    {



        try {
            IJob.Stub job = new IJob.Stub() {
                @Override
                public int getTotalPages() {
                    return bitmaps.size();
                }
                @Override
                public Bitmap renderPageFragment(int num, Rect fragment) throws RemoteException {
                    Bitmap bitmap = bitmaps.get(num);
                    if (!rotate) return bitmap;
                    else {
                        Matrix matrix = new Matrix();
                        matrix.postRotate(90);

                        Bitmap result = Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);
                        //result = result.createScaledBitmap(result,fragment.width(),fragment.height(),true);
                        //result = result.createScaledBitmap(result,bitmap.getWidth()-100,bitmap.getHeight()-100,true);
                        //saveBitmap(result, path);



                        return result;
                    }
                }
            };



            intentApi.print(job, 1);
        } catch (RemoteException ex)
        {
            ErrorLogs.error(ex);
        }
    }

    private void saveBitmap(Bitmap bmp, String path)
    {
        try {
            //String file_path = Environment.getDataDirectory().getAbsolutePath();

            //String filePath = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES).getAbsolutePath();
            String filePath = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES).getAbsolutePath() + "/mockFolder/";
            File f = new File(filePath);
            f.mkdirs();

            File file = new File(filePath, "test.png");
            FileOutputStream fOut = new FileOutputStream(file);


            bmp.compress(Bitmap.CompressFormat.PNG, 85, fOut);
            fOut.flush();
            fOut.close();
        } catch (Exception ex){
            ErrorLogs.error(ex);
        }
    }


/*

    private static Bitmap getWebViewBitmap(WebView webView, int width, int height)
    {
        try {
            //float scale = webView.getScale();
            //int height = (int) (webView.getContentHeight() * scale + 0.5);
            Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
            Canvas canvas = new Canvas(bitmap);
            webView.draw(canvas);
            return bitmap;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }*/

    public void configurePrinter()
    {
        intentApi.setupCurrentPrinter();
    }

    private void setPaperSize()
    {
        try {
            IPrinterInfo printer = intentApi.getCurrentPrinter();
            if (printer==null) setPrinterStatus("Printer not configured."); //intentApi.setupCurrentPrinter();
            else {

                PrinterName = printer.getName();

                PaperWidth = printer.getPrinterContext().getPaperWidth();
                PaperHeight = printer.getPrinterContext().getPaperHeight();

                int xDpi = printer.getPrinterContext().getHResolution();
                int yDpi = printer.getPrinterContext().getVResolution();


                // in dots
/*
            BitmapWidth = PaperWidth * xDpi / 72;
            BitmapHeight = PaperHeight * yDpi / 72;
            */

                BitmapWidth = PaperHeight * yDpi / 72;
                BitmapHeight = PaperWidth * xDpi / 72;

                List<PrintHandOption> imageOptions = intentApi.getImagesOptions();
                for (PrintHandOption option : imageOptions) {
                    if (option.getId().equals("size"))
                        option.setValue(option.getValuesList().get(1));
                    else if (option.getId().equals("orientation"))
                        option.setValue(option.getValuesList().get(2));
                    else if (option.getId().equals("margins"))
                        option.setValue(option.getValuesList().get(0));
                    else if (option.getId().equals("align"))
                        option.setValue(option.getValuesList().get(1));
                    else if (option.getId().equals("crop"))
                        option.setValue(option.getValuesList().get(1));
                }
                intentApi.setImagesOptions(imageOptions);


                BitmapWidth = 1062;
                BitmapHeight = (int) ((double) BitmapWidth / 3.5 * 1.1428);
                //BitmapHeight=350;

                //BitmapHeight=300;


                setPrinterStatus("Printer ready: " + PrinterName);
            }
        } catch (Exception ex) {
            setPrinterStatus(ex.toString());
        }
    }

    public static Boolean isReady()
    {
        return BitmapWidth>0;
        //return intentApi.isServiceRunning();
    }


    public void detach() {
        if (intentApi != null) {
            intentApi.stopService(null);
            try {
                intentApi.setServiceCallback(null);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            try {
                intentApi.setPrintCallback(null);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            intentApi = null;
        }
    }


}