using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public class DonationSummary
    {
        public int Week;
        public double TotalAmount;
        public string FundName;

        public DonationSummary(DataRow row)
        {
            if (row.Table.Columns.Contains("Week") && !Convert.IsDBNull(row["Week"])) this.Week = Convert.ToInt32(row["Week"]);
            if (row.Table.Columns.Contains("TotalAmount") && !Convert.IsDBNull(row["TotalAmount"])) this.TotalAmount = Convert.ToDouble(row["TotalAmount"]);
            if (row.Table.Columns.Contains("FundName") && !Convert.IsDBNull(row["FundName"])) this.FundName = Convert.ToString(row["FundName"]);
        }

    }
}
