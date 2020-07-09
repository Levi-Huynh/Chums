using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        [HttpGet]
        public List<Models.Role> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Roles", "View");
            ChurchLib.Roles roles = ChurchLib.Roles.LoadAll(au.ChurchId);
            List<Models.Role> result = new List<Models.Role>();
            foreach (ChurchLib.Role r in roles) result.Add(new Models.Role(r));
            return result;
        }

        [HttpGet("{id}")]
        public Models.Role Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Roles", "View");
            ChurchLib.Role r = ChurchLib.Role.Load(id, au.ChurchId);
            if (r.ChurchId == au.ChurchId) return new Models.Role(r); else return null;
        }

        [HttpPost]
        public int[] Post([FromBody]List<Models.Role> roles)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Roles", "Edit");

            ChurchLib.Roles dbRoles = new ChurchLib.Roles();
            foreach (Models.Role role in roles)
            {
                ChurchLib.Role dbRole = ConvertToDb(role, au);
                dbRoles.Add(dbRole);
            }
            VerifyChurchIds(dbRoles, au.ChurchId);
            dbRoles.SaveAll();
            return dbRoles.GetIds();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Notes", "Edit");
            ChurchLib.Note.Delete(id, au.ChurchId);
        }

        private ChurchLib.Role ConvertToDb(Models.Role r, Helpers.AuthenticatedUser au)
        {
            ChurchLib.Role db = new ChurchLib.Role() { ChurchId = au.ChurchId };
            db.Id = r.Id;
            if (r.Name != null) db.Name = r.Name;
            return db;
        }

        private void VerifyChurchIds(ChurchLib.Roles roles, int churchId)
        {
            List<int> ids = new List<int>(roles.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.Role r in ChurchLib.Roles.Load(ids.ToArray(), churchId)) if (r.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }


    }
}
