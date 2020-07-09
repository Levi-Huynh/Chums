using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {

        [Route("Search")]
        [HttpGet]
        public List<Models.Service> Search()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            int campusId = Convert.ToInt32(HttpContext.Request.Query["campusId"].ToString());
            ChurchLib.Services services = ChurchLib.Services.LoadByChurchCampus(au.ChurchId, campusId).GetActive();
            List<Models.Service> result = new List<Models.Service>();
            foreach (ChurchLib.Service s in services) result.Add(new Models.Service(s));
            return result;
        }

        [HttpGet]
        public List<Models.Service> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            ChurchLib.Services services = ChurchLib.Services.LoadNamesWithCampus(au.ChurchId).GetActive();
            List<Models.Service> result = new List<Models.Service>();
            foreach (ChurchLib.Service service in services) result.Add(new Models.Service(service));
            return result;
        }

        [HttpGet("{id}")]
        public Models.Service Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            ChurchLib.Service s = ChurchLib.Service.Load(id, au.ChurchId);
            if (s.ChurchId == au.ChurchId && !s.Removed) return new Models.Service(s); else return null;
        }

        [HttpPost]
        public int[] Post([FromBody]List<Models.Service> services)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Services", "Edit");

            ChurchLib.Services dbServices = new ChurchLib.Services();
            foreach (Models.Service service in services)
            {
                ChurchLib.Service dbService = ConvertToDb(service, au);
                dbServices.Add(dbService);
            }
            VerifyChurchIds(dbServices, au.ChurchId);
            dbServices.SaveAll();
            return dbServices.GetIds();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Services", "Edit");
            ChurchLib.Service s = ChurchLib.Service.Load(id, au.ChurchId);
            if (s.ChurchId == au.ChurchId)
            {
                s.Removed = true;
                s.Save();
            }
        }

        private ChurchLib.Service ConvertToDb(Models.Service s, Helpers.AuthenticatedUser au)
        {
            ChurchLib.Service db = new ChurchLib.Service() { ChurchId = au.ChurchId };
            db.Id = s.Id;
            db.CampusId = s.CampusId;
            db.Name = s.Name;
            return db;
        }

        private void VerifyChurchIds(ChurchLib.Services services, int churchId)
        {
            List<int> ids = new List<int>(services.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.Service s in ChurchLib.Services.Load(ids.ToArray(), churchId)) if (s.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}
