using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public class DonationSummaries:List<DonationSummary>
    {
        public string[] GetFundNames()
        {
            List<string> result = new List<string>();
            foreach (DonationSummary ds in this) if (!result.Contains(ds.FundName)) result.Add(ds.FundName);
            return result.ToArray();
        }

        public DonationSummaries GetByFundName(string fundName)
        {
            DonationSummaries result = new DonationSummaries();
            foreach (ChurchLib.DonationSummary ds in this) if (ds.FundName == fundName) result.Add(ds);
            return result;
        }

        public int[] GetWeeks()
        {
            List<int> result = new List<int>();
            foreach (DonationSummary ds in this) if (!result.Contains(ds.Week)) result.Add(ds.Week);
            return result.ToArray();
        }

        public DonationSummaries GetByWeek(int week)
        {
            DonationSummaries result = new DonationSummaries();
            foreach (ChurchLib.DonationSummary ds in this) if (ds.Week == week) result.Add(ds);
            return result;
        }

        public static DonationSummaries Load(int churchId, DateTime startDate, DateTime endDate)
        {
            string sql = "SELECT week(d.DonationDate, 0) as Week, SUM(fd.Amount) as TotalAmount, f.Name as FundName"
                + " FROM Donations d"
                + " INNER JOIN FundDonations fd on fd.DonationId = d.Id"
                + " INNER JOIN Funds f on f.Id = fd.FundId"
                + " WHERE d.ChurchId=@ChurchId"
                + " AND d.DonationDate BETWEEN @StartDate AND @EndDate"
                + " GROUP BY week(d.DonationDate, 0), f.Name"
                + " ORDER BY week(d.DonationDate, 0), f.Name";
            return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId), new MySqlParameter("@StartDate", startDate), new MySqlParameter("@EndDate", endDate) });
        }

        public static DonationSummaries ConvertFromDt(DataTable dt)
        {
            DonationSummaries result = new DonationSummaries();
            foreach (DataRow row in dt.Rows) result.Add(new DonationSummary(row));
            return result;
        }

        public static DonationSummaries Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDt(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }
    }
}
