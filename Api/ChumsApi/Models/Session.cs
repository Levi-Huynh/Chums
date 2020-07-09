using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class Session
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int ServiceTimeId { get; set; }
        public DateTime SessionDate { get; set; }
        public string DisplayName { get; set; }

        public Session()
        {
        }

        public Session(ChurchLib.Session s)
        {
            this.Id = s.Id;
            this.GroupId = s.GroupId;
            this.ServiceTimeId = s.ServiceTimeId;
            this.SessionDate = s.SessionDate;
            this.DisplayName = s.DisplayName;
            
        }

    }
}