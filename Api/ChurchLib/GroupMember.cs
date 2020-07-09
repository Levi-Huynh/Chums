using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class GroupMember
    {
        public DateTime PhotoUpdated { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string GroupName { get; set; }

        public static GroupMember GetExtended(DataRow row)
        {
            GroupMember gm = new GroupMember(row);
            if (row.Table.Columns.Contains("PhotoUpdated")) gm.PhotoUpdated = (Convert.IsDBNull(row["PhotoUpdated"])) ? DateTime.MinValue : Convert.ToDateTime(row["PhotoUpdated"]);
            if (row.Table.Columns.Contains("Email")) gm.Email = (Convert.IsDBNull(row["Email"])) ? "" : Convert.ToString(row["Email"]);
            if (row.Table.Columns.Contains("FirstName") && row.Table.Columns.Contains("LastName") && row.Table.Columns.Contains("NickName")) gm.DisplayName = Person.GetDisplayName(Convert.ToString(row["FirstName"]), Convert.ToString(row["LastName"]), Convert.ToString(row["NickName"]));
            if (row.Table.Columns.Contains("GroupName")) gm.GroupName = (Convert.IsDBNull(row["GroupName"])) ? "" : Convert.ToString(row["GroupName"]);
            return gm;
        }

    }
}
