using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class VisitSessions
    {
        public int[] GetSessionIds()
        {
            List<int> result = new List<int>();
            foreach (VisitSession vs in this) if (!result.Contains(vs.SessionId)) result.Add(vs.SessionId);
            return result.ToArray();
        }

        public static VisitSessions LoadAll(int churchId)
        {
            return Load("SELECT * FROM VisitSessions WHERE ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }

        public static VisitSessions LoadBySessionIdExtended(int churchId, int sessionId)
        {
            string sql = "SELECT vs.*, v.PersonId, p.PhotoUpdated, p.FirstName, p.LastName, p.NickName, p.Email FROM"
                + " VisitSessions vs"
                + " INNER JOIN Visits v on v.Id = vs.VisitId"
                + " INNER JOIN People p on p.Id = v.PersonId"
                + " WHERE vs.ChurchId=@ChurchId AND vs.SessionId = @SessionId";
            return LoadExtended(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId), new MySqlParameter("@SessionId", sessionId) });
        }

        public static VisitSessions ConvertFromDtExtended(DataTable dt)
        {
            VisitSessions result = new VisitSessions();
            foreach (DataRow row in dt.Rows) result.Add(VisitSession.GetExtended(row));
            return result;
        }

        public static VisitSessions LoadExtended(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDtExtended(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }

        public static void Delete(int[] ids)
        {
            if (ids.Length == 0) return;
            DbHelper.ExecuteNonQuery("DELETE VisitSessions WHERE Id IN (" + String.Join(",", ids) + ")", CommandType.Text, null);
        }

        public static VisitSessions LoadByVisitIds(int[] visitIds)
        {
            if (visitIds.Length == 0) return new VisitSessions();
            else return Load("SELECT * FROM VisitSessions WHERE VisitId IN (" + String.Join(",", visitIds) + ")", CommandType.Text, null);
        }

    }
}
