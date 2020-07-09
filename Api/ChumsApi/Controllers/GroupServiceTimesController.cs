using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class GroupServiceTimesController : ControllerBase
    {
        [HttpGet]
        public List<Models.GroupServiceTime> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Groups", "View");

            ChurchLib.GroupServiceTimes times = null;
            if (HttpContext.Request.Query["groupId"].ToString() != "")
            {
                int groupId = Convert.ToInt32(HttpContext.Request.Query["groupId"].ToString());
                times = ChurchLib.GroupServiceTimes.LoadWithServiceNames(au.ChurchId, groupId);
            } else
            {
                times = ChurchLib.GroupServiceTimes.LoadAll(au.ChurchId);
            }

            List<Models.GroupServiceTime> result = new List<Models.GroupServiceTime>();
            foreach (ChurchLib.GroupServiceTime time in times) result.Add(new Models.GroupServiceTime(time));
            return result;
        }

        [HttpGet("{id}")]
        public Models.GroupServiceTime Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Groups", "View");
            ChurchLib.GroupServiceTime gst = ChurchLib.GroupServiceTime.Load(id, au.ChurchId);
            if (gst.ChurchId == au.ChurchId) return new Models.GroupServiceTime(gst); else return null;
        }

        [HttpPost]
        public int[] Post([FromBody]List<Models.GroupServiceTime> times)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Groups", "Edit");

            ChurchLib.GroupServiceTimes dbTimes = new ChurchLib.GroupServiceTimes();
            foreach (Models.GroupServiceTime time in times)
            {
                ChurchLib.GroupServiceTime dbTime = ConvertToDb(time, au);
                dbTimes.Add(dbTime);
            }
            VerifyChurchIds(dbTimes, au.ChurchId);
            dbTimes.SaveAll();
            return dbTimes.GetIds();
        }


        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Groups", "Edit");
            ChurchLib.GroupServiceTime.Delete(id, au.ChurchId);
        }

        private ChurchLib.GroupServiceTime ConvertToDb(Models.GroupServiceTime t, Helpers.AuthenticatedUser au)
        {
            ChurchLib.GroupServiceTime db = new ChurchLib.GroupServiceTime() { ChurchId = au.ChurchId, GroupId = t.GroupId, ServiceTimeId = t.ServiceTimeId };
            return db;
        }

        private void VerifyChurchIds(ChurchLib.GroupServiceTimes serviceTimes, int churchId)
        {
            List<int> ids = new List<int>(serviceTimes.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.GroupServiceTime gst in ChurchLib.GroupServiceTimes.Load(ids.ToArray(), churchId)) if (gst.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}
