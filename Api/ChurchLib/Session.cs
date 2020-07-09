using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;


namespace ChurchLib
{
    public partial class Session
    {
        public string DisplayName { get; set; }

        public static Session GetExtended(DataRow row)
        {
            Session s = new Session(row);
            if (row.Table.Columns.Contains("DisplayName")) s.DisplayName = (Convert.IsDBNull(row["DisplayName"])) ? "" : Convert.ToString(row["DisplayName"]);
            return s;
        }


        public static Session LoadByGroupIdServiceTimeIdSessionDate(int groupId, int serviceTimeId, DateTime sessionDate)
        {
            string sql = "SELECT * FROM Sessions WHERE GroupId=@GroupId AND ServiceTimeId=@ServiceTimeId AND SessionDate = @SessionDate";
            return Load(sql, CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@GroupId", groupId),
                new MySqlParameter("@ServiceTimeId", serviceTimeId),
                new MySqlParameter("@SessionDate", sessionDate)
            });
        }

    }
}
