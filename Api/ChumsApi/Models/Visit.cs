using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class Visit
    {
        public int Id { get; set; }
        public int PersonId { get; set; }
        public int? ServiceId { get; set; }
        public int? GroupId { get; set; }
        public DateTime VisitDate { get; set; }
        public DateTime CheckinTime { get; set; }
        public int AddedBy { get; set; }
        public List<VisitSession> VisitSessions { get; set; }
        public Person Person { get; set; }

        public Visit()
        {
        }

        public Visit(ChurchLib.Visit v)
        {
            this.Id = v.Id;
            this.PersonId = v.PersonId;
            if (!v.IsServiceIdNull) this.ServiceId = v.ServiceId;
            this.GroupId = v.GroupId;
            this.VisitDate = v.VisitDate;
            this.CheckinTime = v.CheckinTime;
            this.AddedBy = v.AddedBy;

            if (v.VisitSessions!=null)
            {
                this.VisitSessions = new List<VisitSession>();
                foreach (ChurchLib.VisitSession vs in v.VisitSessions) this.VisitSessions.Add(new VisitSession(vs));
            }

        }

    }
}