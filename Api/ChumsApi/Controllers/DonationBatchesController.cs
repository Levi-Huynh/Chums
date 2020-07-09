using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DonationBatchesController : ControllerBase
    {
        // GET: api/DonationBatch
        [HttpGet]
        public List<Models.DonationBatch> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "View Summary");

            ChurchLib.DonationBatches batches = ChurchLib.DonationBatches.LoadExtended(au.ChurchId);
            List<Models.DonationBatch> result = new List<Models.DonationBatch>();
            foreach (ChurchLib.DonationBatch b in batches) result.Add(new Models.DonationBatch(b));
            return result;
        }

        // GET: api/DonationBatch/5
        [HttpGet("{id}")]
        public Models.DonationBatch Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "View Summary");
            ChurchLib.DonationBatch b = ChurchLib.DonationBatch.Load(id, au.ChurchId);
            if (b.ChurchId == au.ChurchId) return new Models.DonationBatch(b); else return null;
        }

        // POST: api/Campuses
        [HttpPost]
        public int[] Post([FromBody]List<Models.DonationBatch> batches)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "Edit");

            ChurchLib.DonationBatches dbBatches = new ChurchLib.DonationBatches();
            foreach (Models.DonationBatch batch in batches)
            {
                ChurchLib.DonationBatch dbBatch = ConvertToDb(batch, au);
                dbBatches.Add(dbBatch);
            }
            VerifyChurchIds(dbBatches, au.ChurchId);
            dbBatches.SaveAll();
            return dbBatches.GetIds();
        }


        // DELETE: api/DonationBatch/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Donations", "Edit");
            if (ChurchLib.Donations.LoadByBatchId(id, au.ChurchId).Count > 0) throw new Exception("You may not delete a batch that currently has donations.");
            ChurchLib.DonationBatch.Delete(id, au.ChurchId);
        }

        private ChurchLib.DonationBatch ConvertToDb(Models.DonationBatch b, Helpers.AuthenticatedUser au)
        {
            ChurchLib.DonationBatch db = new ChurchLib.DonationBatch() { ChurchId = au.ChurchId, Id=b.Id, BatchDate=b.BatchDate, Name=b.Name };
            return db;
        }
        private void VerifyChurchIds(ChurchLib.DonationBatches batches, int churchId)
        {
            List<int> ids = new List<int>(batches.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.DonationBatch b in ChurchLib.DonationBatches.Load(ids.ToArray(), churchId)) if (b.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}
