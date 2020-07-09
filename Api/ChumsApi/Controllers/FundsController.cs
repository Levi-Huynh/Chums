using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FundsController : ControllerBase
    {
        [HttpGet]
        public List<Models.Fund> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "View");
            ChurchLib.Funds funds = ChurchLib.Funds.LoadAll(au.ChurchId).GetActive().Sort("Name", false);
            List<Models.Fund> result = new List<Models.Fund>();
            foreach (ChurchLib.Fund fund in funds) result.Add(new Models.Fund(fund));
            return result;
        }

        [HttpGet("{id}")]
        public Models.Fund Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "View");
            ChurchLib.Fund fund = ChurchLib.Fund.Load(id, au.ChurchId);
            if (fund.ChurchId != au.ChurchId && !fund.Removed) return null;
            else return new Models.Fund(fund);
        }

        [HttpPost]
        public int[] Post([FromBody]List<Models.Fund> funds)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "Edit");

            ChurchLib.Funds dbFunds = new ChurchLib.Funds();
            foreach (Models.Fund fund in funds)
            {
                ChurchLib.Fund dbFund = ConvertToDb(fund, au);
                dbFunds.Add(dbFund);
            }
            VerifyChurchIds(dbFunds, au.ChurchId);
            dbFunds.SaveAll();
            return dbFunds.GetIds();
        }


        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "Edit");
            ChurchLib.Fund f = ChurchLib.Fund.Load(id, au.ChurchId);
            if (f.ChurchId == au.ChurchId)
            {
                f.Removed = true;
                f.Save();
            }
        }

        private ChurchLib.Fund ConvertToDb(Models.Fund f, Helpers.AuthenticatedUser au)
        {
            ChurchLib.Fund db = new ChurchLib.Fund() { ChurchId = au.ChurchId, Id = f.Id, Name=f.Name };
            return db;
        }

        private void VerifyChurchIds(ChurchLib.Funds funds, int churchId)
        {
            List<int> ids = new List<int>(funds.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.Fund f in ChurchLib.Funds.Load(ids.ToArray(), churchId)) if (f.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}
