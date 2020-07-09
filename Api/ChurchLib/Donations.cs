using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class Donations
    {
        public static Donations LoadAll(int churchId)
        {
            return Load("SELECT * FROM Donations WHERE ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }

        public double TotalAmount
        {
            get
            {
                double result = 0;
                foreach (Donation d in this) result += d.Amount;
                return result;
            }
        }

        

        public static Donations LoadByPersonIdExtended(int churchId, int personId)
        {
            string sql = "SELECT d.*, f.Name as FundName"
                + " FROM Donations d"
                + " INNER JOIN FundDonations fd on fd.DonationId = d.Id"
                + " INNER JOIN Funds f on f.Id = fd.FundId"
                + " WHERE d.ChurchId = @ChurchId AND d.PersonId = @PersonId";

            return LoadExtended(sql, CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@PersonId", personId)
            });
        }


        public static Donations LoadByBatchIdExtended(int churchId, int batchId)
        {
            return LoadExtended("SELECT d.*, p.FirstName, p.LastName, p.NickName FROM Donations d LEFT OUTER JOIN People p on p.Id=d.PersonId WHERE d.ChurchId=@ChurchId AND d.BatchId=@BatchId", CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@BatchId", batchId)
            });
        }

        public static Donations ConvertFromDtExtended(DataTable dt)
        {
            Donations result = new Donations();
            foreach (DataRow row in dt.Rows) result.Add(Donation.GetExtended(row));
            return result;
        }

        public static Donations LoadExtended(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDtExtended(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }
    }
}
