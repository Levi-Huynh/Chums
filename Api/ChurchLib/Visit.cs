using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;


namespace ChurchLib
{
    public partial class Visit
    {
        public VisitSessions VisitSessions { get; set; }

        public static Visit LoadForSessionPerson(int churchId, int sessionId, int personId)
        {
            string sql = "SELECT v.*"
                + " FROM Sessions s"
                + " LEFT OUTER JOIN ServiceTimes st on st.Id = s.ServiceTimeId"
                + " INNER JOIN Visits v on(v.ServiceId = st.ServiceId or v.GroupId = s.GroupId) and v.VisitDate = s.SessionDate"
                + " WHERE v.ChurchId=@ChurchId AND s.Id = @SessionId AND v.PersonId=@PersonId LIMIT 1";
            return Load(sql, CommandType.Text, new MySqlParameter[] { 
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@SessionId", sessionId),
                new MySqlParameter("@PersonId", personId)
            });
        }


    }
}
