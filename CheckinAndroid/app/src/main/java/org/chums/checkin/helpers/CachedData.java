package org.chums.checkin.helpers;

import org.chums.checkin.models.People;
import org.chums.checkin.models.ServiceTimes;
import org.chums.checkin.models.Visits;

public class CachedData {
    public static String ApiKey;
    public static String AccessManagementApiRoot = "https://api.staging.livecs.org";
    public static String ApiRoot = "https://api.staging.chums.org";
    //public static String ApiRoot = "http://192.168.1.34:8081";
    public static String ContentBaseUrl = "https://app.staging.chums.org";
    public static int SelectedHouseholdId;
    public static int ServiceId;
    public static int ServiceTimeId;
    public static ServiceTimes ServiceTimes;
    public static People HouseholdMembers;

    public static Visits LoadedVisits;
    public static Visits PendingVisits;
    public static int CheckinPersonId;

}
