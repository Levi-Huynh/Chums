using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;


namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RolePermissionsController : ControllerBase
    {
        [HttpGet]
        public List<Models.RolePermission> Get()
        {
            //Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Roles", "View");
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);

            ChurchLib.RolePermissions permissions = null;
            if (HttpContext.Request.Query["roleId"].ToString() != "")
            {
                int roleId = Convert.ToInt32(HttpContext.Request.Query["roleId"].ToString());
                permissions = ChurchLib.RolePermissions.LoadByRoleId(roleId, au.ChurchId);
            } else if (HttpContext.Request.Query["personId"].ToString() != "")
            {
                int personId = Convert.ToInt32(HttpContext.Request.Query["personId"].ToString());
                permissions = ChurchLib.RolePermissions.LoadByPersonId(au.ChurchId, personId);
            }

            List<Models.RolePermission> result = new List<Models.RolePermission>();
            foreach (ChurchLib.RolePermission permission in permissions) result.Add(new Models.RolePermission(permission));
            return result;
        }

        [HttpPost]
        public int[] Post([FromBody]List<Models.RolePermission> permissions)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Roles", "Edit");

            ChurchLib.RolePermissions dbPermissions = new ChurchLib.RolePermissions();
            foreach (Models.RolePermission permission in permissions)
            {
                ChurchLib.RolePermission dbPermission = ConvertToDb(permission, au);
                if (dbPermission.Id>0) dbPermissions.Add(dbPermission);
                else
                {
                    if (ChurchLib.RolePermissions.LoadByRoleId(permission.RoleId, au.ChurchId).GetByContentTypeAction(permission.ContentType, permission.Action).Count == 0) dbPermissions.Add(dbPermission);
                }
            }
            VerifyChurchIds(dbPermissions, au.ChurchId);
            dbPermissions.SaveAll();
            return dbPermissions.GetIds();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Roles", "Edit");
            ChurchLib.RolePermission.Delete(id, au.ChurchId);
        }

        private ChurchLib.RolePermission ConvertToDb(Models.RolePermission rp, Helpers.AuthenticatedUser au)
        {
            ChurchLib.RolePermission db = new ChurchLib.RolePermission() { ChurchId = au.ChurchId };
            db.Id = rp.Id;
            db.RoleId = rp.RoleId;
            db.ContentType = rp.ContentType;
            if (rp.ContentId != null) db.ContentId = rp.ContentId.Value;
            db.Action = rp.Action;
            return db;
        }

        private void VerifyChurchIds(ChurchLib.RolePermissions rolePermissions, int churchId)
        {
            List<int> ids = new List<int>(rolePermissions.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.RolePermission rp in ChurchLib.RolePermissions.Load(ids.ToArray(), churchId)) if (rp.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}

