using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        [Route("Search")]
        [HttpGet]
        public List<Models.Group> Search()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Groups", "View");
            int campusId = Convert.ToInt32(HttpContext.Request.Query["campusId"].ToString());
            int serviceId = Convert.ToInt32(HttpContext.Request.Query["serviceId"].ToString());
            int serviceTimeId = Convert.ToInt32(HttpContext.Request.Query["serviceTimeId"].ToString());
            ChurchLib.Groups groups = ChurchLib.Groups.LoadByChurchCampusServiceTime(au.ChurchId, campusId, serviceId, serviceTimeId).GetActive();
            List<Models.Group> result = new List<Models.Group>();
            foreach (ChurchLib.Group g in groups) result.Add(new Models.Group(g));
            return result;
        }

        [HttpGet]
        public List<Models.Group> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Groups", "View");

            ChurchLib.Groups groups = ChurchLib.Groups.LoadAllExtended(au.ChurchId).GetActive();
            List<Models.Group> result = new List<Models.Group>();
            foreach (ChurchLib.Group g in groups) result.Add(new Models.Group(g));
            return result;
        }

        [HttpGet("{id}")]
        public Models.Group Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Groups", "View");
            ChurchLib.Group g = ChurchLib.Group.Load(id, au.ChurchId);
            if (g.ChurchId == au.ChurchId && !g.Removed) return new Models.Group(g); else return null;
        }

        [HttpPost]
        public int[] Post([FromBody]List<Models.Group> groups)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Groups", "Edit");

            ChurchLib.Groups dbGroups = new ChurchLib.Groups();
            foreach (Models.Group group in groups)
            {
                ChurchLib.Group dbGroup = ConvertToDb(group, au);
                dbGroups.Add(dbGroup);
            }
            VerifyChurchIds(dbGroups, au.ChurchId);
            dbGroups.SaveAll();
            return dbGroups.GetIds();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Groups", "Edit");
            ChurchLib.Group g = ChurchLib.Group.Load(id, au.ChurchId);
            if (g.ChurchId == au.ChurchId)
            {
                g.Removed = true;
                g.Save();
            }
        }


        private ChurchLib.Group ConvertToDb(Models.Group g, Helpers.AuthenticatedUser au)
        {
            ChurchLib.Group db = new ChurchLib.Group() { ChurchId = au.ChurchId };
            db.Id = g.Id;
            if (g.CategoryName!=null) db.CategoryName = g.CategoryName;
            if (g.Name != null) db.Name = g.Name;
            if (g.TrackAttendance != null) db.TrackAttendance = g.TrackAttendance.Value;
            return db;
        }

        private void VerifyChurchIds(ChurchLib.Groups groups, int churchId)
        {
            List<int> ids = new List<int>(groups.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.Group g in ChurchLib.Groups.Load(ids.ToArray(), churchId)) if (g.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}
