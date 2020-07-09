using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class FundDonation
    {
        public DateTime DonationDate { get; set; }
        public int BatchId { get; set; }
        public string DisplayName { get; set; }
        public int PersonId { get; set; }

        

        public static FundDonation GetExtended(DataRow row)
        {
            FundDonation fd = new FundDonation(row);
            if (row.Table.Columns.Contains("DonationDate")) fd.DonationDate = Convert.ToDateTime(row["DonationDate"]);
            if (row.Table.Columns.Contains("BatchId")) fd.BatchId = Convert.ToInt32(row["BatchId"]);
            if (row.Table.Columns.Contains("PersonId") && !Convert.IsDBNull(row["PersonId"])) fd.PersonId = Convert.ToInt32(row["PersonId"]);
            if (row.Table.Columns.Contains("FirstName") && row.Table.Columns.Contains("LastName") && row.Table.Columns.Contains("NickName")) fd.DisplayName = Person.GetDisplayName(Convert.ToString(row["FirstName"]), Convert.ToString(row["LastName"]), Convert.ToString(row["NickName"]));
            return fd;
        }

    }
}
