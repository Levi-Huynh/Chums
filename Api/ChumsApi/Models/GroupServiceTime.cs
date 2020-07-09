using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class GroupServiceTime
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int ServiceTimeId { get; set; }
        public ServiceTime ServiceTime { get; set; }

        public GroupServiceTime()
        {
        }

        public GroupServiceTime(ChurchLib.GroupServiceTime gst)
        {
            this.Id = gst.Id;
            this.GroupId = gst.GroupId;
            this.ServiceTimeId = gst.ServiceTimeId;
            if (gst.ServiceTimeName!=null && gst.ServiceTimeName!="")
            {
                this.ServiceTime = new ServiceTime() { Id=gst.ServiceTimeId, Name=gst.ServiceTimeName };
            }
        }

    }
}