using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class VisitSessionsController : ControllerBase
    {
        [HttpGet]
        public List<Models.VisitSession> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Attendance", "View");

            ChurchLib.VisitSessions visitSessions = null;
            if (HttpContext.Request.Query["sessionId"].ToString() != "")
            {
                int sessionId = Convert.ToInt32(HttpContext.Request.Query["sessionId"].ToString());
                visitSessions = ChurchLib.VisitSessions.LoadBySessionIdExtended(au.ChurchId, sessionId);
            } else visitSessions = ChurchLib.VisitSessions.LoadAll(au.ChurchId);

            List<Models.VisitSession> result = new List<Models.VisitSession>();
            foreach (ChurchLib.VisitSession visitSession in visitSessions) result.Add(new Models.VisitSession(visitSession));
            return result;
        }

        [HttpPost]
        public int[] Post([FromBody] List<Models.VisitSession> visitSessions)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Attendance", "Edit");

            ChurchLib.VisitSessions dbVisitSessions = new ChurchLib.VisitSessions();
            foreach (Models.VisitSession visitSession in visitSessions)
            {
                ChurchLib.VisitSession dbVisitSession = ConvertToDb(visitSession, au);
                dbVisitSessions.Add(dbVisitSession);
            }
            VerifyChurchIds(dbVisitSessions, au.ChurchId);
            dbVisitSessions.SaveAll();
            return dbVisitSessions.GetIds();
        }


        [Route("Log")]
        [HttpPost]
        public string Log([FromBody]Models.Visit visit)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Attendance", "Edit");
            ChurchLib.VisitSession.Log(au.ChurchId, visit.VisitSessions[0].SessionId, visit.PersonId, au.PersonId);
            return "{}";
        }

        [HttpDelete]
        public void Delete()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Attendance", "Edit");
            int sessionId = Convert.ToInt32(HttpContext.Request.Query["sessionId"].ToString());
            int personId = Convert.ToInt32(HttpContext.Request.Query["personId"].ToString());
            ChurchLib.VisitSession.Remove(au.ChurchId, sessionId, personId);
        }


        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Attendance", "Edit");
            ChurchLib.VisitSession.Delete(id, au.ChurchId);
        }

        private void VerifyChurchIds(ChurchLib.VisitSessions visitSessions, int churchId)
        {
            List<int> ids = new List<int>(visitSessions.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.VisitSession v in ChurchLib.VisitSessions.Load(ids.ToArray(), churchId)) if (v.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

        public static ChurchLib.VisitSession ConvertToDb(Models.VisitSession v, Helpers.AuthenticatedUser au)
        {
            ChurchLib.VisitSession db = new ChurchLib.VisitSession() { ChurchId = au.ChurchId };
            db.Id = v.Id;
            db.VisitId = v.VisitId;
            db.SessionId = v.SessionId;
            return db;
        }

    }
}
