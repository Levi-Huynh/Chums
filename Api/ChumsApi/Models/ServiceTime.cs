using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class ServiceTime
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public string Name { get; set; }
        public string LongName { get; set; }
        public List<Group> Groups { get; set; }


        public ServiceTime()
        {
        }

        public ServiceTime(ChurchLib.ServiceTime s)
        {
            this.Id = s.Id;
            this.Name = s.Name;
            this.LongName = s.LongName;
            this.ServiceId = s.ServiceId;
        }

    }
}