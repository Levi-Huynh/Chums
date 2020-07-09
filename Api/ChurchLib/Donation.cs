using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;


namespace ChurchLib
{
    public partial class Donation
    {
        public string DisplayName { get; set; }
        public string FundName { get; set; }

        public static Donation GetExtended(DataRow row)
        {
            Donation d = new Donation(row);
            if (row.Table.Columns.Contains("FirstName") && row.Table.Columns.Contains("LastName") && row.Table.Columns.Contains("NickName"))
            {
                d.DisplayName = Person.GetDisplayName(Convert.ToString(row["FirstName"]), Convert.ToString(row["LastName"]), Convert.ToString(row["NickName"]));
                if (d.DisplayName == "") d.DisplayName = "Anonymous";
            }
            if (row.Table.Columns.Contains("FundName")) d.FundName = Convert.ToString(row["FundName"]);
            return d;
        }


    }
}
