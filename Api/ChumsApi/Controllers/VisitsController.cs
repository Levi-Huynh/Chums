using System;
using System.Collections;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class VisitsController : ControllerBase
    {
        private static Hashtable sessionIds = new Hashtable();
        

        private int GetSessionId(Helpers.AuthenticatedUser au, int serviceTimeId, int groupId)
        {
            string key = DateTime.Today.ToString("yyyyMMdd") + serviceTimeId.ToString() + "_" + groupId.ToString();
            if (sessionIds.ContainsKey(key)) return (int)sessionIds[key];
            else
            {
                ChurchLib.Session session = ChurchLib.Session.LoadByGroupIdServiceTimeIdSessionDate(groupId, serviceTimeId, DateTime.Today);
                if (session==null)
                {
                    session = new ChurchLib.Session() { ChurchId = au.ChurchId, GroupId = groupId, ServiceTimeId = serviceTimeId, SessionDate = DateTime.Today };
                    session.Save();
                }
                sessionIds[key] = session.Id;
                return session.Id;
            }
        }

        [HttpGet]
        public List<Models.Visit> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            ChurchLib.Visits visits = ChurchLib.Visits.LoadAll(au.ChurchId);
            List<Models.Visit> result = new List<Models.Visit>();
            foreach (ChurchLib.Visit visit in visits) result.Add(new Models.Visit(visit));
            return result;
        }


        [Route("Checkin")]
        [HttpGet]
        public List<Models.Visit> Checkin()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);

            int serviceId = Convert.ToInt32(HttpContext.Request.Query["serviceId"].ToString());
            int householdId = Convert.ToInt32(HttpContext.Request.Query["householdId"].ToString());

            ChurchLib.Visits visits = ChurchLib.Visits.LoadByHouseholdIdSessionDate(householdId, serviceId, DateTime.Today);
            ChurchLib.VisitSessions visitSessions = ChurchLib.VisitSessions.LoadByVisitIds(visits.GetIds());
            ChurchLib.Sessions sessions = ChurchLib.Sessions.Load(visitSessions.GetSessionIds(), au.ChurchId);

            List<Models.Visit> result = new List<Models.Visit>();
            foreach (ChurchLib.Visit visit in visits)
            {
                visit.VisitSessions = visitSessions.GetAllByVisitId(visit.Id);
                Models.Visit visitModel = new Models.Visit(visit);
                foreach (Models.VisitSession vs in visitModel.VisitSessions)
                {
                    vs.Session = new Models.Session(sessions.GetById(vs.SessionId));
                }
                result.Add(visitModel);
            }
            return result;

        }


        [Route("Checkin")]
        [HttpPost]
        public void CheckinPost([FromBody]List<Models.Visit> visits)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);

            int serviceId = Convert.ToInt32(HttpContext.Request.Query["serviceId"].ToString());
            int householdId = Convert.ToInt32(HttpContext.Request.Query["householdId"].ToString());


            //Convert submitted to DB records.
            ChurchLib.Visits dbVisits = new ChurchLib.Visits();
            foreach (Models.Visit visit in visits)
            {
                ChurchLib.Visit dbVisit = ConvertToDb(visit, au);
                dbVisit.VisitSessions = new ChurchLib.VisitSessions();

                
                foreach (Models.VisitSession visitSession in visit.VisitSessions) {
                    //Lookup the session id based on serviceid, groupid.  Create it if needed
                    ChurchLib.VisitSession dbSession = VisitSessionsController.ConvertToDb(visitSession, au);
                    dbSession.SessionId = GetSessionId(au, visitSession.Session.ServiceTimeId, visitSession.Session.GroupId);
                    dbVisit.VisitSessions.Add(dbSession);
                }
                dbVisits.Add(dbVisit);
            }

            ChurchLib.Visits.ReconcileAndSave(dbVisits, serviceId, householdId, DateTime.Today);
            
            

            

            //return result;
        }


        [HttpGet("{id}")]
        public Models.Visit Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Attendance", "View");
            ChurchLib.Visit v = ChurchLib.Visit.Load(id, au.ChurchId);
            if (v.ChurchId == au.ChurchId) return new Models.Visit(v); else return null;
        }

        [HttpPost]
        public int[] Post([FromBody]List<Models.Visit> visits)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Attendance", "Edit");

            ChurchLib.Visits dbVisits = new ChurchLib.Visits();
            foreach (Models.Visit visit in visits)
            {
                ChurchLib.Visit dbVisit = ConvertToDb(visit, au);
                dbVisits.Add(dbVisit);
            }
            VerifyChurchIds(dbVisits, au.ChurchId);
            dbVisits.SaveAll();
            return dbVisits.GetIds();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Attendance", "Edit");
            ChurchLib.Visit.Delete(id, au.ChurchId);
        }

        private ChurchLib.Visit ConvertToDb(Models.Visit v, Helpers.AuthenticatedUser au)
        {
            ChurchLib.Visit db = new ChurchLib.Visit() { ChurchId = au.ChurchId };
            db.Id = v.Id;
            db.AddedBy = v.AddedBy;
            db.CheckinTime = v.CheckinTime;
            if (v.GroupId != null) db.GroupId = v.GroupId.Value;
            db.PersonId = v.PersonId;
            if (v.ServiceId!=null) db.ServiceId = v.ServiceId.Value;
            db.VisitDate = v.VisitDate;


            if (db.VisitDate == DateTime.MinValue) db.VisitDate = DateTime.Today;
            if (db.CheckinTime == DateTime.MinValue) db.CheckinTime = DateTime.UtcNow;

            return db;
        }

       

        private void VerifyChurchIds(ChurchLib.Visits visits, int churchId)
        {
            List<int> ids = new List<int>(visits.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.Visit v in ChurchLib.Visits.Load(ids.ToArray(), churchId)) if (v.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}
