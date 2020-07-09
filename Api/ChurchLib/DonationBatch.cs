using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class DonationBatch
    {
        public int DonationCount { get; set; }
        public double TotalAmount { get; set; }

        public static DonationBatch GetExtended(DataRow row)
        {
            DonationBatch b = new DonationBatch(row);
            if (row.Table.Columns.Contains("DonationCount")) b.DonationCount = Convert.ToInt32(row["DonationCount"]);
            if (row.Table.Columns.Contains("TotalAmount")) b.TotalAmount = Convert.ToDouble(row["TotalAmount"]);
            return b;
        }

    }
}
