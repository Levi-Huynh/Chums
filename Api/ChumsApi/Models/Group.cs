using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class Group
    {
        public int Id { get; set; }
        public string CategoryName { get; set; }
        public string Name { get; set; }
        public bool? TrackAttendance { get; set; }
        public int? MemberCount { get; set; }

        public Group()
        {
        }

        public Group(ChurchLib.Group g)
        {
            this.Id = g.Id;
            this.CategoryName = g.CategoryName;
            this.Name = g.Name;
            this.TrackAttendance = g.TrackAttendance;
            this.MemberCount = g.MemberCount;

        }

    }
}