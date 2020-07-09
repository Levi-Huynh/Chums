using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class Visits
    {
        public static Visits LoadAll(int churchId)
        {
            return Load("SELECT * FROM Visits WHERE ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }

        public static Visits ReconcileAndSave(Visits submittedVisits, int serviceId,  int householdId, DateTime sessionDate)
        {
            List<int> deleteVisitIds = new List<int>();
            List<int> deleteVisitSessionIds = new List<int>();

            ChurchLib.Visits existingVisits = ChurchLib.Visits.LoadByHouseholdIdSessionDate(householdId, serviceId, sessionDate);
            ChurchLib.VisitSessions existingVisitSessions = ChurchLib.VisitSessions.LoadByVisitIds(existingVisits.GetIds());

            foreach (ChurchLib.Visit existingVisit in existingVisits)
            {
                existingVisit.VisitSessions = existingVisitSessions.GetAllByVisitId(existingVisit.Id);
                ChurchLib.Visits matchedSubmittedVisits = submittedVisits.GetAllByPersonId(existingVisit.PersonId);
                
                if (matchedSubmittedVisits.Count==0)
                {
                    //Person has been removed this time.  Remove the visit and sessions
                    deleteVisitIds.Add(existingVisit.Id);
                    foreach (ChurchLib.VisitSession evs in existingVisit.VisitSessions) deleteVisitSessionIds.Add(evs.Id);
                } else
                {
                    //Person is still checked in.  Make sure none of the sessions were removed.
                    matchedSubmittedVisits[0].Id = existingVisit.Id;
                    foreach (ChurchLib.VisitSession evs in existingVisit.VisitSessions)
                    {
                        ChurchLib.VisitSessions matchedSessions = matchedSubmittedVisits[0].VisitSessions.GetAllBySessionId(evs.SessionId);
                        if (matchedSessions.Count == 0) deleteVisitSessionIds.Add(evs.Id);
                        else matchedSessions[0].Id = evs.Id;
                    }
                }
            }

            //Save the submitted visits and sessions.
            submittedVisits.SaveAll();
            foreach (ChurchLib.Visit submittedVisit in submittedVisits)
            {
                foreach (ChurchLib.VisitSession submittedVisitSession in submittedVisit.VisitSessions) submittedVisitSession.VisitId = submittedVisit.Id;
                submittedVisit.VisitSessions.SaveAll();
            }

            //Delete what needs to be deleted
            if (deleteVisitIds.Count > 0) ChurchLib.Visits.Delete(deleteVisitIds.ToArray());
            if (deleteVisitSessionIds.Count > 0) ChurchLib.VisitSessions.Delete(deleteVisitSessionIds.ToArray());
            return submittedVisits;
        }

        public static Visits LoadByHouseholdIdSessionDate(int householdId, int serviceId, DateTime visitDate)
        {
            string sql = "SELECT * FROM Visits WHERE ServiceId = @ServiceId AND VisitDate = @VisitDate AND PersonId IN (SELECT PersonId FROM HouseholdMembers WHERE HouseholdId = @HouseholdId)";
            return Load(sql, CommandType.Text, new MySqlParameter[] { 
                new MySqlParameter("@ServiceId", serviceId),
                new MySqlParameter("@VisitDate", visitDate),
                new MySqlParameter("@HouseholdId", householdId)
            });
        }


        public static void Delete(int[] ids)
        {
            if (ids.Length == 0) return;
            DbHelper.ExecuteNonQuery("DELETE Visits WHERE Id IN (" + String.Join(",", ids) + ")", CommandType.Text, null);
        }

    }
}
