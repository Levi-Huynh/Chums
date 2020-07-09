using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FundDonationsController : ControllerBase
    {
        
        [HttpGet]
        public List<Models.FundDonation> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "View");

            ChurchLib.FundDonations fundDonations = null;
            if (HttpContext.Request.Query["donationId"].ToString() != "")
            {
                int donationId = Convert.ToInt32(HttpContext.Request.Query["donationId"].ToString());
                fundDonations = ChurchLib.FundDonations.LoadByDonationId(donationId, au.ChurchId);
            }
            else if (HttpContext.Request.Query["fundId"].ToString() != "")
            {
                int fundId = Convert.ToInt32(HttpContext.Request.Query["fundId"].ToString());
                if (HttpContext.Request.Query["startDate"].ToString() == "") fundDonations = ChurchLib.FundDonations.LoadByFundIdExtended(fundId);
                else
                {
                    DateTime startDate = Convert.ToDateTime(HttpContext.Request.Query["StartDate"].ToString());
                    DateTime endDate = Convert.ToDateTime(HttpContext.Request.Query["EndDate"].ToString());
                    fundDonations = ChurchLib.FundDonations.LoadByFundIdDateExtended(fundId, startDate, endDate);
                }
            }
            else fundDonations = ChurchLib.FundDonations.LoadAll(au.ChurchId);

            List<Models.FundDonation> result = new List<Models.FundDonation>();
            foreach (ChurchLib.FundDonation fundDonation in fundDonations) result.Add(new Models.FundDonation(fundDonation));
            return result;
        }

        [HttpGet("{id}")]
        public Models.FundDonation Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "View");
            ChurchLib.FundDonation fd = ChurchLib.FundDonation.Load(id, au.ChurchId);
            if (fd.ChurchId == au.ChurchId) return new Models.FundDonation(fd); else return null;
        }

        [HttpPost]
        public int[] Post([FromBody]List<Models.FundDonation> fundDonations)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "Edit");

            ChurchLib.FundDonations dbFundDonations = new ChurchLib.FundDonations();
            foreach (Models.FundDonation fundDonation in fundDonations)
            {
                ChurchLib.FundDonation dbFundDonation = ConvertToDb(fundDonation, au);
                dbFundDonations.Add(dbFundDonation);
            }
            VerifyChurchIds(dbFundDonations, au.ChurchId);
            dbFundDonations.SaveAll();
            return dbFundDonations.GetIds();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "Edit");
            ChurchLib.FundDonation.Delete(id, au.ChurchId);
        }

        private ChurchLib.FundDonation ConvertToDb(Models.FundDonation fd, Helpers.AuthenticatedUser au)
        {
            ChurchLib.FundDonation db = new ChurchLib.FundDonation() { Id=fd.Id, FundId=fd.FundId, DonationId=fd.DonationId, Amount=fd.Amount, ChurchId=au.ChurchId };
            return db;
        }

        private void VerifyChurchIds(ChurchLib.FundDonations fundDonations, int churchId)
        {
            List<int> ids = new List<int>(fundDonations.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.FundDonation f in ChurchLib.FundDonations.Load(ids.ToArray(), churchId)) if (f.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}
