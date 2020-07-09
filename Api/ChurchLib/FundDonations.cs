using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class FundDonations
    {
        public static FundDonations LoadAll(int churchId)
        {
            return Load("SELECT * FROM FundDonations WHERE ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }

        public static FundDonations LoadByFundIdExtended(int fundId)
        {
            string sql = "SELECT fd.*, d.DonationDate, d.BatchId, d.PersonId, p.FirstName, p.LastName, p.NickName FROM FundDonations fd INNER JOIN Donations d on d.Id=fd.DonationId LEFT JOIN People p on p.Id=d.PersonId WHERE fd.FundId=@FundId ORDER by d.DonationDate desc";
            return LoadExtended(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@FundId", fundId) });
        }

        public static FundDonations LoadByFundIdDateExtended(int fundId, DateTime startDate, DateTime endDate)
        {
            string sql = "SELECT fd.*, d.DonationDate, d.BatchId, d.PersonId, p.FirstName, p.LastName, p.NickName FROM FundDonations fd INNER JOIN Donations d on d.Id=fd.DonationId LEFT JOIN People p on p.Id=d.PersonId WHERE fd.FundId=@FundId and d.DonationDate BETWEEN @StartDate AND @EndDate ORDER by d.DonationDate desc";
            return LoadExtended(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@FundId", fundId), new MySqlParameter("@StartDate", startDate), new MySqlParameter("@EndDate", endDate) });
        }

        public static FundDonations ConvertFromDtExtended(DataTable dt)
        {
            FundDonations result = new FundDonations();
            foreach (DataRow row in dt.Rows) result.Add(FundDonation.GetExtended(row));
            return result;
        }

        public static FundDonations LoadExtended(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDtExtended(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }

    }
}
