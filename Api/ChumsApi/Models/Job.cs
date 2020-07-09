using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChumsApiCore.Models
{
    public class Job
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string JobType { get; set; }
        public string AssociatedFile { get; set; }

        public Job()
        {
        }

        public Job(ChurchLib.Job j)
        {
            this.Id = j.Id;
            this.StartTime = j.StartTime;
            if (!j.IsEndTimeNull) this.EndTime = j.EndTime;
            this.JobType = j.JobType;
            this.AssociatedFile = j.AssociatedFile;

        }
    }
}
