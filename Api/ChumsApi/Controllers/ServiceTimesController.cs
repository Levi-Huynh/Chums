using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ServiceTimesController : ControllerBase
    {
        [Route("Search")]
        [HttpGet]
        public List<Models.ServiceTime> Search()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            int campusId = Convert.ToInt32(HttpContext.Request.Query["campusId"].ToString());
            int serviceId = Convert.ToInt32(HttpContext.Request.Query["serviceId"].ToString());
            ChurchLib.ServiceTimes serviceTimes = ChurchLib.ServiceTimes.LoadByChurchCampusService(au.ChurchId, campusId, serviceId).GetActive();
            List<Models.ServiceTime> result = new List<Models.ServiceTime>();
            foreach (ChurchLib.ServiceTime st in serviceTimes) result.Add(new Models.ServiceTime(st));
            return result;
        }

        [HttpGet]
        public List<Models.ServiceTime> Get()
        {

            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            int serviceId = (HttpContext.Request.Query["serviceId"].Count==0) ? 0 :  Convert.ToInt32(HttpContext.Request.Query["serviceId"].ToString());
            ChurchLib.ServiceTimes times = null;
            if (serviceId > 0) times = ChurchLib.ServiceTimes.LoadNamesWithCampusService(au.ChurchId, serviceId).GetActive();
            else times = ChurchLib.ServiceTimes.LoadNamesWithCampusService(au.ChurchId).GetActive();
            List<Models.ServiceTime> result = new List<Models.ServiceTime>();
            foreach (ChurchLib.ServiceTime t in times) result.Add(new Models.ServiceTime(t));

            List<string> include = Utils.GetInclude(HttpContext);
            if (include.Contains("groups") && result.Count>0)
            {
                ChurchLib.GroupServiceTimes allGroupServiceTimes = ChurchLib.GroupServiceTimes.LoadByServiceTimeIds(times.GetIds());
                ChurchLib.Groups allGroups = ChurchLib.Groups.Load(allGroupServiceTimes.GetGroupIds(), au.ChurchId);

                foreach (Models.ServiceTime st in result)
                {
                    ChurchLib.GroupServiceTimes groupServiceTimes = allGroupServiceTimes.GetAllByServiceTimeId(st.Id);
                    ChurchLib.Groups groups = allGroups.GetAllByIds(groupServiceTimes.GetGroupIds());
                    st.Groups = new List<Models.Group>();
                    foreach (ChurchLib.Group group in groups) st.Groups.Add(new Models.Group(group));
                }
            }


            
            return result;
        }

        [HttpGet("{id}")]
        public Models.ServiceTime Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            ChurchLib.ServiceTime s = ChurchLib.ServiceTime.Load(id, au.ChurchId);
            if (s.ChurchId == au.ChurchId && !s.Removed) return new Models.ServiceTime(s); else return null;
        }

        [HttpPost]
        public int[] Post([FromBody]List<Models.ServiceTime> times)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Services", "Edit");

            ChurchLib.ServiceTimes dbTimes = new ChurchLib.ServiceTimes();
            foreach (Models.ServiceTime time in times)
            {
                ChurchLib.ServiceTime dbTime = ConvertToDb(time, au);
                dbTimes.Add(dbTime);
            }
            VerifyChurchIds(dbTimes, au.ChurchId);
            dbTimes.SaveAll();
            return dbTimes.GetIds();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Services", "Edit");
            ChurchLib.ServiceTime st = ChurchLib.ServiceTime.Load(id, au.ChurchId);
            if (st.ChurchId == au.ChurchId)
            {
                st.Removed = true;
                st.Save();
            }
        }

        private ChurchLib.ServiceTime ConvertToDb(Models.ServiceTime t, Helpers.AuthenticatedUser au)
        {
            ChurchLib.ServiceTime db = new ChurchLib.ServiceTime() { ChurchId = au.ChurchId };
            db.Id = t.Id;
            db.ServiceId = t.ServiceId;
            db.Name = t.Name;
            return db;
        }

        private void VerifyChurchIds(ChurchLib.ServiceTimes serviceTimes, int churchId)
        {
            List<int> ids = new List<int>(serviceTimes.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.ServiceTime s in ChurchLib.ServiceTimes.Load(ids.ToArray(), churchId)) if (s.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}
