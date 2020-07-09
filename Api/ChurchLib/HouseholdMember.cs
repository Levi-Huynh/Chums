using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class HouseholdMember
    {
        public DateTime PhotoUpdated { get; set; }
        public DateTime Birthdate { get; set; }
        public string DisplayName { get; set; }
        public string LastName { get; set; }


        public static HouseholdMember GetExtended(DataRow row)
        {
            HouseholdMember hm = new HouseholdMember(row);
            if (row.Table.Columns.Contains("PhotoUpdated")) hm.PhotoUpdated = (Convert.IsDBNull(row["PhotoUpdated"])) ? DateTime.MinValue : Convert.ToDateTime(row["PhotoUpdated"]);
            if (row.Table.Columns.Contains("Birthdate")) hm.Birthdate = (Convert.IsDBNull(row["Birthdate"])) ? DateTime.MinValue : Convert.ToDateTime(row["Birthdate"]);
            if (row.Table.Columns.Contains("LastName")) hm.LastName = Convert.ToString(row["LastName"]);
            if (row.Table.Columns.Contains("FirstName") && row.Table.Columns.Contains("LastName") && row.Table.Columns.Contains("NickName")) hm.DisplayName = Person.GetDisplayName(Convert.ToString(row["FirstName"]), Convert.ToString(row["LastName"]), Convert.ToString(row["NickName"]));
            return hm;
        }


    }
}
