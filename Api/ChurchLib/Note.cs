using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class Note
    {
        public DateTime PhotoUpdated { get; set; }
        public string DisplayName { get; set; }


        public static Note GetExtended(DataRow row)
        {
            Note n = new Note(row);
            if (row.Table.Columns.Contains("PhotoUpdated")) n.PhotoUpdated = (Convert.IsDBNull(row["PhotoUpdated"])) ? DateTime.MinValue : Convert.ToDateTime(row["PhotoUpdated"]);
            if (row.Table.Columns.Contains("FirstName") && row.Table.Columns.Contains("LastName") && row.Table.Columns.Contains("NickName")) n.DisplayName = Person.GetDisplayName(Convert.ToString(row["FirstName"]), Convert.ToString(row["LastName"]), Convert.ToString(row["NickName"]));
            return n;
        }
        


    }
}
