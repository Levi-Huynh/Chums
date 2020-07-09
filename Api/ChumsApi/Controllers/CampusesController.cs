using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CampusesController : ControllerBase
    {
        // GET: api/Campuses
        [HttpGet]
        public List<Models.Campus> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            ChurchLib.Campuses campuses = ChurchLib.Campuses.LoadByChurchId(au.ChurchId).GetActive();
            List<Models.Campus> result = new List<Models.Campus>();
            foreach (ChurchLib.Campus campus in campuses) result.Add(new Models.Campus(campus));
            return result;
        }

        // GET: api/Campuses/5
        [HttpGet("{id}")]
        public Models.Campus Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            ChurchLib.Campus c = ChurchLib.Campus.Load(id, au.ChurchId);
            if (c.ChurchId == au.ChurchId  && !c.Removed) return new Models.Campus(c); else return null;
        }

        // POST: api/Campuses
        [HttpPost]
        public int[] Post([FromBody]List<Models.Campus> campuses)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Services", "Edit");

            ChurchLib.Campuses dbCampuses = new ChurchLib.Campuses();
            foreach (Models.Campus campus in campuses)
            {
                ChurchLib.Campus dbCampus = ConvertToDb(campus, au);
                dbCampuses.Add(dbCampus);
            }

            VerifyChurchIds(dbCampuses, au.ChurchId);
            dbCampuses.SaveAll();

            return dbCampuses.GetIds();
        }

        // DELETE: api/Campuses/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Services", "Edit");
            ChurchLib.Campus c = ChurchLib.Campus.Load(id, au.ChurchId);
            if (c.ChurchId==au.ChurchId)
            {
                c.Removed = true;
                c.Save();
            }
        }

        private ChurchLib.Campus ConvertToDb(Models.Campus c, Helpers.AuthenticatedUser au)
        {
            ChurchLib.Campus db = new ChurchLib.Campus() { ChurchId = au.ChurchId };
            db.Id = c.Id;
            db.Name = c.Name;
            if (c.Address1 != null) db.Address1 = c.Address1;
            if (c.Address2 != null) db.Address2 = c.Address2;
            if (c.Address1 != null) db.Address1 = c.City;
            if (c.State != null) db.State = c.State;
            if (c.Zip != null) db.Zip = c.Zip;
            return db;
        }

        private void VerifyChurchIds(ChurchLib.Campuses campuses, int churchId)
        {
            List<int> ids = new List<int>(campuses.GetIds());
            ids.Remove(0);
            if (ids.Count>0)
            {
                foreach (ChurchLib.Campus c in ChurchLib.Campuses.Load(ids.ToArray(), churchId)) if (c.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}
