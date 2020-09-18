package org.chums.checkin.helpers;

import android.content.Context;

public class PrinterHelper {
    public static String Status = "Pending init";
    static PrintHandHelper phh;
    static Context context = null;
    static Runnable statusChangeRunnable;
    public static boolean readyToPrint=false;




    public static void init()
    {
        Runnable r = new Runnable() { @Override public void run() {
            if (phh.Status=="Initialized") setStatus("Initialized");
            else if (phh.Status == "PrintHand not installed.") setStatus("PrintHand required to enable printing.  You may still checkin.");
            else if (phh.Status == "Printer not configured.") setStatus(phh.Status);
            else if (phh.Status.contains("Printer ready")) {
                setStatus(phh.Status);
                readyToPrint=true;
            }
            checkPrinterStatus();
        } };
        phh = new PrintHandHelper(r);
    }

    public static void setStatus(String status)
    {
        Status = status;
        if (statusChangeRunnable!=null){
            try {
                statusChangeRunnable.run();
            } catch (Exception e) {}
        }
        //fire and event
        checkPrinterStatus();
    }

    public static void bind(Context _context, Runnable runnable)
    {
        if (phh==null) init();
        context = _context;
        statusChangeRunnable = runnable;
        checkPrinterStatus();
    }

    public static void checkPrinterStatus()
    {
        if (Status=="Pending init") { setStatus("Initializing print service."); phh.initSdk(context); }
        else if (phh.Status == "PrintHand not installed.") setStatus("PrintHand required to enable printing.  You may still checkin.");
        else if (Status=="Initialized") { attachToPrinter(); }
    }

    private static void attachToPrinter()
    {
        setStatus("Detecting printer.");
        phh.attach(context);
    }

    public static void configure()
    {
        try {
            phh.configurePrinter();
        } catch (Exception ex) {
            setStatus("Please install PrintHand application.");
        }
    }


}
