using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        //this may go unused.  Looking into handling this in the react app

        /*
        [HttpGet]
        public List<Models.Job> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Admin", "Import/Export");
            ChurchLib.Jobs jobs = ChurchLib.Jobs.LoadByChurchId(au.ChurchId);
            List<Models.Job> result = new List<Models.Job>();
            foreach (ChurchLib.Job j in jobs) result.Add(new Models.Job(j));
            return result;
        }

        [HttpPost]
        public int[] Post([FromBody] List<Models.Job> jobs)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Admin", "Import/Export");

            ChurchLib.Jobs dbJobs = new ChurchLib.Jobs();
            foreach (Models.Job job in jobs)
            {
                if (job.Id == 0)
                {
                    ChurchLib.Job dbJob = ConvertToDb(job, au);
                    dbJobs.Add(dbJob);
                }
            }

            dbJobs.SaveAll();
            ProcessJobs(dbJobs);
            return dbJobs.GetIds();
        }


        private ChurchLib.Job ConvertToDb(Models.Job j, Helpers.AuthenticatedUser au)
        {
            ChurchLib.Job db = new ChurchLib.Job() { ChurchId = au.ChurchId, StartTime=DateTime.UtcNow, JobType = j.JobType };
            return db;
        }

        private void ProcessJobs(ChurchLib.Jobs jobs)
        {
            foreach (ChurchLib.Job job in jobs) ProcessJob(job);
        }

        private void ProcessJob(ChurchLib.Job job)
        {
            if (job.JobType == "export") ProcessExport(job);
        }

        private void ProcessExport(ChurchLib.Job job)
        {
            ChurchLib.People people = ChurchLib.People.LoadByChurchId(job.ChurchId);
            //people.ToCsvDataTable();
        }
        */
    }
}
