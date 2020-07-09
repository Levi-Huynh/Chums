using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase
    {
        [HttpGet]
        public List<Models.Session> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);

            ChurchLib.Sessions sessions = null;
            if (HttpContext.Request.Query["groupId"].ToString() != "")
            {
                int groupId = Convert.ToInt32(HttpContext.Request.Query["groupId"].ToString());
                sessions = ChurchLib.Sessions.LoadByGroupIdWithNames(groupId);
            }
            else sessions = ChurchLib.Sessions.LoadAll(au.ChurchId);

            List<Models.Session> result = new List<Models.Session>();
            foreach (ChurchLib.Session session in sessions) result.Add(new Models.Session(session));
            return result;
        }

        [HttpGet("{id}")]
        public Models.Session Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            ChurchLib.Session s = ChurchLib.Session.Load(id, au.ChurchId);
            if (s.ChurchId == au.ChurchId) return new Models.Session(s); else return null;
        }

        [HttpPost]
        public int[] Post([FromBody]List<Models.Session> sessions)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Attendance", "Edit");

            ChurchLib.Sessions dbSessions = new ChurchLib.Sessions();
            foreach (Models.Session session in sessions)
            {
                ChurchLib.Session dbSession = ConvertToDb(session, au);
                dbSessions.Add(dbSession);
            }
            VerifyChurchIds(dbSessions, au.ChurchId);
            dbSessions.SaveAll();
            return dbSessions.GetIds();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Attendance", "Edit");
            ChurchLib.Session.Delete(id, au.ChurchId);
        }

        private ChurchLib.Session ConvertToDb(Models.Session s, Helpers.AuthenticatedUser au)
        {
            ChurchLib.Session db = new ChurchLib.Session() { ChurchId = au.ChurchId, Id=s.Id, GroupId=s.GroupId, ServiceTimeId=s.ServiceTimeId, SessionDate=s.SessionDate };
            return db;
        }

        private void VerifyChurchIds(ChurchLib.Sessions sessions, int churchId)
        {
            List<int> ids = new List<int>(sessions.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.Session s in ChurchLib.Sessions.Load(ids.ToArray(), churchId)) if (s.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}
