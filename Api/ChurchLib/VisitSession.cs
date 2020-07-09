using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class VisitSession
    {
        public DateTime PhotoUpdated { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public int PersonId { get; set; }



        public static VisitSession GetExtended(DataRow row)
        {
            VisitSession vs = new VisitSession(row);
            if (row.Table.Columns.Contains("PersonId")) vs.PersonId = (Convert.IsDBNull(row["PersonId"])) ? 0 : Convert.ToInt32(row["PersonId"]);
            if (row.Table.Columns.Contains("PhotoUpdated")) vs.PhotoUpdated = (Convert.IsDBNull(row["PhotoUpdated"])) ? DateTime.MinValue : Convert.ToDateTime(row["PhotoUpdated"]);
            if (row.Table.Columns.Contains("Email")) vs.Email = (Convert.IsDBNull(row["Email"])) ? "" : Convert.ToString(row["Email"]);
            if (row.Table.Columns.Contains("FirstName") && row.Table.Columns.Contains("LastName") && row.Table.Columns.Contains("NickName")) vs.DisplayName = Person.GetDisplayName(Convert.ToString(row["FirstName"]), Convert.ToString(row["LastName"]), Convert.ToString(row["NickName"]));
            return vs;
        }

        public static VisitSession LoadByVisitIdSessionId(int visitId, int sessionId)
        {
            return Load("SELECT * FROM VisitSessions WHERE VisitId=@VisitId and SessionId=@SessionId", CommandType.Text, new MySqlParameter[] { 
                new MySqlParameter("@VisitId", visitId),
                new MySqlParameter("@SessionId", sessionId)
            });
        }

        public static void Log(int churchId, int sessionId, int personId, int addedBy)
        {
            bool newVisit = false;
            ChurchLib.Visit visit = ChurchLib.Visit.LoadForSessionPerson(churchId, sessionId, personId);
            if (visit == null)
            {
                ChurchLib.Session session = ChurchLib.Session.Load(sessionId, churchId);
                visit = new ChurchLib.Visit() { AddedBy = addedBy, CheckinTime = DateTime.UtcNow, ChurchId = churchId, PersonId = personId, VisitDate = session.SessionDate };
                if (session.IsServiceTimeIdNull) visit.GroupId = session.GroupId;
                else
                {
                    ChurchLib.ServiceTime st = ChurchLib.ServiceTime.Load(session.ServiceTimeId, churchId);
                    visit.ServiceId = st.ServiceId;
                }
                visit.Save();
                newVisit = true;
            }
            ChurchLib.VisitSession existingSession = null;
            if (!newVisit) existingSession = ChurchLib.VisitSession.LoadByVisitIdSessionId(visit.Id, sessionId);
            if (existingSession == null)
            {
                ChurchLib.VisitSession vs = new ChurchLib.VisitSession() { ChurchId = churchId, PersonId = personId, SessionId = sessionId, VisitId = visit.Id };
                vs.Save();
            }
        }

        public static void Remove(int churchId, int sessionId, int personId)
        {
            ChurchLib.Visit visit = ChurchLib.Visit.LoadForSessionPerson(churchId, sessionId, personId);
            if (visit != null)
            {
                ChurchLib.VisitSession existingSession = ChurchLib.VisitSession.LoadByVisitIdSessionId(visit.Id, sessionId);
                if (existingSession!=null) ChurchLib.VisitSession.Delete(existingSession.Id, churchId);
                ChurchLib.VisitSessions sessions = ChurchLib.VisitSessions.LoadByVisitId(visit.Id, churchId);
                if (sessions.Count == 0) ChurchLib.Visit.Delete(visit.Id, churchId);
            }
        }

        


    }
}
