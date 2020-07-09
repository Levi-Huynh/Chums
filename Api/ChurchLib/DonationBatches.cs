using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class DonationBatches
    {
        

        public static DonationBatches LoadExtended(int churchId)
        {
            string sql = "SELECT *"
                + " , IFNULL((SELECT Count(*) FROM Donations WHERE BatchId = db.Id),0) AS DonationCount"
                + " , IFNULL((SELECT SUM(Amount) FROM Donations WHERE BatchId = db.Id),0) AS TotalAmount"
                + " FROM DonationBatches db"
                + " WHERE db.ChurchId = @ChurchId";
            return LoadExtended(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId), });
        }

        public static DonationBatches ConvertFromDtExtended(DataTable dt)
        {
            DonationBatches result = new DonationBatches();
            foreach (DataRow row in dt.Rows) result.Add(DonationBatch.GetExtended(row));
            return result;
        }

        public static DonationBatches LoadExtended(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDtExtended(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }
    }
}
