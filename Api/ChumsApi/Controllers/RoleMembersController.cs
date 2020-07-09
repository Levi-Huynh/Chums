using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;


namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RoleMembersController : ControllerBase
    {
        [HttpGet]
        public List<Models.RoleMember> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Roles", "View");

            ChurchLib.RoleMembers members = null;
            if (HttpContext.Request.Query["roleId"] != "")
            {
                int roleId = Convert.ToInt32(HttpContext.Request.Query["roleId"].ToString());
                members = ChurchLib.RoleMembers.LoadByRoleIdExtended(au.ChurchId, roleId);
            }
            else
            {
                int personId = Convert.ToInt32(HttpContext.Request.Query["personId"].ToString());
                members = ChurchLib.RoleMembers.LoadByPersonIdExtended(au.ChurchId, personId);
            }


            List<Models.RoleMember> result = new List<Models.RoleMember>();
            foreach (ChurchLib.RoleMember member in members) result.Add(new Models.RoleMember(member));
            return result;
        }

        [HttpPost]
        public int[] Post([FromBody]List<Models.RoleMember> members)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Roles", "Edit");

            ChurchLib.RoleMembers dbMembers = new ChurchLib.RoleMembers();
            foreach (Models.RoleMember member in members)
            {
                ChurchLib.RoleMember dbMember = ConvertToDb(member, au);

                //Associate the user account with this church if it isn't already.
                if (MasterLib.UserMappings.LoadByChurchIdPersonId(au.ChurchId, member.PersonId).Count==0)
                {
                    ChurchLib.Person p = ChurchLib.Person.Load(member.PersonId, au.ChurchId);
                    if (p.Email!=null && p.Email!="")
                    {
                        MasterLib.User u = MasterLib.User.LoadByEmail(p.Email);
                        if (u==null)
                        {
                            u = new MasterLib.User() { DateRegistered = DateTime.UtcNow, Email = p.Email, Password=MasterLib.User.HashPassword("welcome"), Name=p.DisplayName };
                            u.Save();
                        }
                        new MasterLib.UserMapping() { ChurchId = au.ChurchId, PersonId = p.Id, UserId = u.Id }.Save();
                    }

                }

                dbMembers.Add(dbMember);
            }
            VerifyChurchIds(dbMembers, au.ChurchId);
            dbMembers.SaveAll();
            return dbMembers.GetIds();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Roles", "Edit");

            ChurchLib.RoleMember rm = ChurchLib.RoleMember.Load(id, au.ChurchId);
            ChurchLib.RoleMember.Delete(id, au.ChurchId);

            //If the person is in no roles, remove their association with this church.
            if (rm != null)
            {
                if (ChurchLib.RoleMembers.LoadByPersonId(rm.PersonId, au.ChurchId).Count==0)
                {
                    foreach (MasterLib.UserMapping mapping in MasterLib.UserMappings.LoadByChurchIdPersonId(rm.ChurchId, rm.PersonId)) MasterLib.UserMapping.Delete(mapping.Id);
                }
            }
        }

        private ChurchLib.RoleMember ConvertToDb(Models.RoleMember rm, Helpers.AuthenticatedUser au)
        {
            ChurchLib.RoleMember db = new ChurchLib.RoleMember() { ChurchId = au.ChurchId };
            db.Id = rm.Id;
            db.RoleId = rm.RoleId;
            db.PersonId = rm.PersonId;
            if (rm.DateAdded == null) db.DateAdded = DateTime.UtcNow; else db.DateAdded = rm.DateAdded.Value;
            return db;
        }

        private void VerifyChurchIds(ChurchLib.RoleMembers roleMembers, int churchId)
        {
            List<int> ids = new List<int>(roleMembers.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.RoleMember rm in ChurchLib.RoleMembers.Load(ids.ToArray(), churchId)) if (rm.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}
