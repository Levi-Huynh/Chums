using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class AttendanceRecord
    {
        public Service Campus { get; set; }
        public Service Service { get; set; }
        public ServiceTime ServiceTime { get; set; }
        public Group Group { get; set; }
        public DateTime VisitDate { get; set; }
        public int Week { get; set; }
        public int Count { get; set; }

        public AttendanceRecord()
        {

        }

        public AttendanceRecord(ChurchLib.AttendanceRecord ar)
        {
            this.VisitDate = ar.VisitDate;
            this.Week = ar.Week;
            this.Count = ar.Count;
            if (ar.GroupId>0 || ar.GroupName!="") this.Group = new Group() { CategoryName = ar.CategoryName, Name = ar.GroupName, Id = ar.GroupId };
            if (ar.ServiceTimeId>0 || ar.ServiceTimeName!="") this.ServiceTime = new ServiceTime() { Id = ar.ServiceTimeId, Name = ar.ServiceTimeName, ServiceId=ar.ServiceId };
            if (ar.ServiceId > 0 || ar.ServiceName!="") this.Service = new Service() { Id = ar.ServiceId, Name = ar.ServiceName, CampusId=ar.CampusId };
            if (ar.CampusId > 0 || ar.CampusName!="") this.Campus = new Service() { Id = ar.CampusId, Name = ar.CampusName };
        }

    }
}