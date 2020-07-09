using System;
using System.Collections.Generic;
using ChumsApiCore.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class HouseholdMembersController : ControllerBase
    {
        [HttpGet]
        public List<Models.HouseholdMember> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);

            ChurchLib.HouseholdMembers members = null;
            if (HttpContext.Request.Query["householdId"].ToString() != "")
            {
                int householdId = Convert.ToInt32(HttpContext.Request.Query["householdId"].ToString());
                members = ChurchLib.HouseholdMembers.LoadByHouseholdIdExtended(au.ChurchId, householdId);
            }
            else
            {
                int personId = Convert.ToInt32(HttpContext.Request.Query["personId"].ToString());
                int householdId = ChurchLib.HouseholdMembers.LoadByPersonId(personId, au.ChurchId)[0].HouseholdId;
                members = ChurchLib.HouseholdMembers.LoadByHouseholdIdExtended(au.ChurchId, householdId);
            }

            List<Models.HouseholdMember> result = new List<Models.HouseholdMember>();
            foreach (ChurchLib.HouseholdMember member in members) result.Add(new Models.HouseholdMember(member));
            return result;
        }

        [HttpPost("{id}")]
        public int[] Post(int id, [FromBody]List<Models.HouseholdMember> members)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Households", "Edit");

            ChurchLib.HouseholdMembers dbMembers = new ChurchLib.HouseholdMembers();
            foreach (Models.HouseholdMember member in members)
            {
                ChurchLib.HouseholdMember dbMember = ConvertToDb(member, au);
                if (dbMember.Id==0 || dbMembers.GetById(dbMember.Id)==null) dbMembers.Add(dbMember);
            }
            VerifyChurchIds(dbMembers, au.ChurchId);

            ChurchLib.HouseholdMembers existingMembers = ChurchLib.HouseholdMembers.LoadByHouseholdId(id, au.ChurchId);
            foreach (ChurchLib.HouseholdMember existingMember in existingMembers)
            {
                if (dbMembers.GetById(existingMember.Id) == null) DeleteMember(existingMember, true, au);
            }

            dbMembers.SaveAll();
            return dbMembers.GetIds();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Households", "Edit");
            DeleteMember(ChurchLib.HouseholdMember.Load(id, au.ChurchId), true, au);
        }

        private void DeleteMember(ChurchLib.HouseholdMember member, bool createNewHousehold, AuthenticatedUser au)
        {
            ChurchLib.HouseholdMember.Delete(member.Id, au.ChurchId);
            if (createNewHousehold)
            {
                ChurchLib.Person p = ChurchLib.Person.Load(member.PersonId, au.ChurchId);
                ChurchLib.Household h = new ChurchLib.Household() { Name = p.LastName, ChurchId=au.ChurchId };
                h.Save();
                new ChurchLib.HouseholdMember() { HouseholdId = h.Id, PersonId = p.Id, Role = "Head", ChurchId=au.ChurchId }.Save();
            }
        }

        private ChurchLib.HouseholdMember ConvertToDb(Models.HouseholdMember hm, Helpers.AuthenticatedUser au)
        {
            ChurchLib.HouseholdMember db = new ChurchLib.HouseholdMember() { Id = hm.Id, ChurchId = au.ChurchId, HouseholdId=hm.HouseholdId, PersonId=hm.PersonId, Role = hm.Role };
            return db;
        }

        private void VerifyChurchIds(ChurchLib.HouseholdMembers members, int churchId)
        {
            List<int> ids = new List<int>(members.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.HouseholdMember hm in ChurchLib.HouseholdMembers.Load(ids.ToArray(), churchId)) if (hm.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }


    }
}
