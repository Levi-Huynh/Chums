using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class HouseholdsController : ControllerBase
    {
        [HttpGet]
        public List<Models.Household> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            int personId = Convert.ToInt32(HttpContext.Request.Query["PersonId"].ToString());
            List<Models.Household> result = new List<Models.Household>();
            result.Add(new Models.Household(ChurchLib.Household.LoadByPersonId(personId)));
            return result;
        }

        [HttpGet("{id}")]
        public Models.Household Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            ChurchLib.Household h = ChurchLib.Household.Load(id, au.ChurchId);
            if (h.ChurchId == au.ChurchId) return new Models.Household(h); else return null;
        }

        [HttpPost]
        public int[] Post([FromBody]List<Models.Household> households)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Households", "Edit");
            ChurchLib.Households dbHouseholds = new ChurchLib.Households();
            foreach (Models.Household household in households)
            {
                ChurchLib.Household dbHousehold = ConvertToDb(household, au);
                dbHouseholds.Add(dbHousehold);
            }
            VerifyChurchIds(dbHouseholds, au.ChurchId);
            dbHouseholds.SaveAll();
            return dbHouseholds.GetIds();
        }




        private ChurchLib.Household ConvertToDb(Models.Household h, Helpers.AuthenticatedUser au)
        {
            ChurchLib.Household db = new ChurchLib.Household() { ChurchId = au.ChurchId };
            db.Id = h.Id;
            db.Name = h.Name;
            return db;
        }

        private void VerifyChurchIds(ChurchLib.Households households, int churchId)
        {
            List<int> ids = new List<int>(households.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.Household h in ChurchLib.Households.Load(ids.ToArray(), churchId)) if (h.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}
