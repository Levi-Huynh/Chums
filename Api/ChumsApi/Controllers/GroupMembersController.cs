using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class GroupMembersController : ControllerBase
    {
        [HttpGet]
        public List<Models.GroupMember> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Group Members", "View");

            ChurchLib.GroupMembers members = null;
            if (HttpContext.Request.Query["groupId"].ToString() != "")
            {
                int groupId = Convert.ToInt32(HttpContext.Request.Query["groupId"].ToString());
                members = ChurchLib.GroupMembers.LoadByGroupIdExtended(au.ChurchId, groupId);
            } else if (HttpContext.Request.Query["personId"].ToString() != "")
            {
                int personId = Convert.ToInt32(HttpContext.Request.Query["personId"].ToString());
                members = ChurchLib.GroupMembers.LoadByPersonIdExtended(au.ChurchId, personId);
            } else
            {
                members = ChurchLib.GroupMembers.LoadAll(au.ChurchId);
            }


            List<Models.GroupMember> result = new List<Models.GroupMember>();
            foreach (ChurchLib.GroupMember member in members) result.Add(new Models.GroupMember(member));
            return result;
        }


        [HttpPost]
        public int[] Post([FromBody]List<Models.GroupMember> members)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Group Members", "Edit");

            ChurchLib.GroupMembers dbMembers = new ChurchLib.GroupMembers();
            foreach (Models.GroupMember member in members)
            {
                ChurchLib.GroupMember dbMember = ConvertToDb(member, au);
                dbMembers.Add(dbMember);
            }
            VerifyChurchIds(dbMembers, au.ChurchId);
            dbMembers.SaveAll();
            return dbMembers.GetIds();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Group Members", "Edit");
            ChurchLib.GroupMember.Delete(id, au.ChurchId);
        }

        private ChurchLib.GroupMember ConvertToDb(Models.GroupMember gm, Helpers.AuthenticatedUser au)
        {
            ChurchLib.GroupMember db = new ChurchLib.GroupMember() { ChurchId = au.ChurchId };
            db.Id = gm.Id;
            db.GroupId = gm.GroupId;
            db.PersonId = gm.PersonId;
            if (gm.JoinDate == null) db.JoinDate = DateTime.UtcNow; else db.JoinDate = gm.JoinDate.Value;
            return db;
        }

        private void VerifyChurchIds(ChurchLib.GroupMembers members, int churchId)
        {
            List<int> ids = new List<int>(members.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.GroupMember gm in ChurchLib.GroupMembers.Load(ids.ToArray(), churchId)) if (gm.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }


    }
}
