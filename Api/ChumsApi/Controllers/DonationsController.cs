using System;
using System.Collections.Generic;
using ChumsApiCore.Models;
using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Common;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DonationsController : ControllerBase
    {
        // GET: api/Donations
        [HttpGet]
        public List<Models.Donation> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "View");

            ChurchLib.Donations donations = null;
            if (HttpContext.Request.Query["batchId"].ToString() != "")
            {
                int batchId = Convert.ToInt32(HttpContext.Request.Query["batchId"].ToString());
                donations = ChurchLib.Donations.LoadByBatchIdExtended(au.ChurchId, batchId);
            }
            else if (HttpContext.Request.Query["personId"].ToString() != "")
            {
                int personId = Convert.ToInt32(HttpContext.Request.Query["personId"].ToString());
                donations = ChurchLib.Donations.LoadByPersonIdExtended(au.ChurchId, personId);
            }
            else donations = ChurchLib.Donations.LoadAll(au.ChurchId);

            List<Models.Donation> result = new List<Models.Donation>();
            foreach (ChurchLib.Donation donation in donations) result.Add(new Models.Donation(donation));
            return result;
        }

        // GET: api/Donations/5
        [HttpGet("{id}")]
        public Models.Donation Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "View");
            ChurchLib.Donation d = ChurchLib.Donation.Load(id, au.ChurchId);

            if (d.ChurchId == au.ChurchId)
            {
                Models.Donation result =  new Models.Donation(d);
                List<string> include = Utils.GetInclude(HttpContext);
                if (include.Contains("person") && d.PersonId>0)
                {
                    ChurchLib.Person p = ChurchLib.Person.Load(d.PersonId, au.ChurchId);
                    result.Person = new Models.Person(p);
                }
                return result;
            }
            else return null;

        }

        // POST: api/Donations
        [HttpPost]
        public int[] Post([FromBody]List<Models.Donation> donations)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "Edit");

            ChurchLib.Donations dbDonations = new ChurchLib.Donations();
            foreach (Models.Donation donation in donations)
            {
                ChurchLib.Donation dbDonation = ConvertToDb(donation, au);
                dbDonations.Add(dbDonation);
            }
            VerifyChurchIds(dbDonations, au.ChurchId);
            dbDonations.SaveAll();
            return dbDonations.GetIds();
        }

        // DELETE: api/Donations/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "Edit");
            ChurchLib.Donation.Delete(id, au.ChurchId);
            foreach (ChurchLib.FundDonation fd in ChurchLib.FundDonations.LoadByDonationId(id, au.ChurchId))
            {
                if (fd.ChurchId == au.ChurchId) ChurchLib.FundDonation.Delete(fd.Id, au.ChurchId);
            }
        }

        private ChurchLib.Donation ConvertToDb(Models.Donation d, Helpers.AuthenticatedUser au)
        {
            ChurchLib.Donation db = new ChurchLib.Donation() { ChurchId = au.ChurchId, Id = d.Id, Amount=d.Amount, BatchId=d.BatchId, DonationDate=d.DonationDate, Method=d.Method};
            if (d.MethodDetails != null) db.MethodDetails = d.MethodDetails;
            if (d.PersonId != null && d.PersonId>0) db.PersonId = d.PersonId.Value;
            if (d.Notes != null) db.Notes = d.Notes;
            return db;
        }

        private void VerifyChurchIds(ChurchLib.Donations donations, int churchId)
        {
            List<int> ids = new List<int>(donations.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.Donation d in ChurchLib.Donations.Load(ids.ToArray(), churchId)) if (d.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}
