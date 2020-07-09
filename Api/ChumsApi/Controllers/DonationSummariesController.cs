using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DonationSummariesController : ControllerBase
    {
        // GET: api/DonationSummaries
        [HttpGet]
        public List<Models.DonationSummary> Get()
        {
            DateTime startDate = new DateTime(2000, 1, 1);
            DateTime endDate = DateTime.UtcNow;
            if (HttpContext.Request.Query["startDate"].ToString() != "") startDate = Convert.ToDateTime(HttpContext.Request.Query["startDate"]);
            if (HttpContext.Request.Query["endDate"].ToString() != "") endDate = Convert.ToDateTime(HttpContext.Request.Query["endDate"]);

            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "View Summary");
            ChurchLib.DonationSummaries summaries = ChurchLib.DonationSummaries.Load(au.ChurchId, startDate, endDate);
            List<Models.DonationSummary> result = new List<Models.DonationSummary>();
            foreach (ChurchLib.DonationSummary s in summaries) result.Add(new Models.DonationSummary(s));
            return result;
        }

    }
}
