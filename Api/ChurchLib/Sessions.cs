using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class Sessions
    {
        public static Sessions LoadAll(int churchId)
        {
            return Load("SELECT * FROM Sessions WHERE ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }

        public static Sessions LoadByGroupIdWithNames(int groupId)
        {
            string sql = "select s.Id, "
                + " CASE"
                + "     WHEN st.Name IS NULL THEN DATE_FORMAT(SessionDate, '%m/%d/%Y')"
                + "     ELSE concat(DATE_FORMAT(SessionDate, '%m/%d/%Y'), ' - ', st.Name)"
                + " END AS DisplayName"
                + " FROM Sessions s"
                + " LEFT OUTER JOIN ServiceTimes st on st.Id = s.ServiceTimeId"
                + " WHERE s.GroupId=@GroupId"
                + " ORDER by s.SessionDate desc";
            return LoadExtended(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@GroupId", groupId) });
        }

        public static Sessions ConvertFromDtExtended(DataTable dt)
        {
            Sessions result = new Sessions();
            foreach (DataRow row in dt.Rows) result.Add(Session.GetExtended(row));
            return result;
        }

        public static Sessions LoadExtended(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDtExtended(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }

    }
}
