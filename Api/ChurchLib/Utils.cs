using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public class Utils
    {
        public static string GetPrettyShortDuration(DateTime theDate)
        {
            long ticks = Math.Abs(DateTime.UtcNow.Ticks - theDate.Ticks);
            return GetPrettyShortDuration(new TimeSpan(ticks).TotalSeconds);
        }

        public static string GetPrettyShortDuration(double totalSeconds)
        {
            string result = "";
            double seconds = totalSeconds;
            List<string> parts = new List<string>();

            if (seconds > 86400)
            {
                int days = (int)Math.Floor(seconds / 86400.0);
                return (days == 1) ? "1 day" : days.ToString() + " days";
            }
            else if (seconds > 3600)
            {
                double hours = (double)Math.Round(seconds / 3600.0, 1);
                return (hours == 1) ? "1 hour" : hours.ToString() + " hours";
            }
            else if (seconds > 60)
            {
                int minutes = (int)Math.Floor(seconds / 60.0);
                return (minutes == 1) ? "1 minute" : minutes.ToString() + " minutes";
            }
            else
            {
                return (seconds == 1) ? "1 second" : Math.Round(seconds).ToString() + " seconds";
            }

        }
    }
}
