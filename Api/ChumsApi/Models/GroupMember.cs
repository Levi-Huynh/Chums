using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class GroupMember
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int PersonId { get; set; }
        public DateTime? JoinDate { get; set; }
        public Person Person { get; set; }
        public Group Group { get; set; }

        public GroupMember()
        {

        }

        public GroupMember(ChurchLib.GroupMember gm)
        {
            this.Id = gm.Id;
            this.GroupId = gm.GroupId;
            this.PersonId = gm.PersonId;
            if (!gm.IsJoinDateNull) this.JoinDate = gm.JoinDate;
            if (gm.DisplayName!="")
            {
                this.Person = new Person() { DisplayName = gm.DisplayName, Email = gm.Email, Id=gm.PersonId, ChurchId=gm.ChurchId };
                if (gm.PhotoUpdated != DateTime.MinValue) this.Person.PhotoUpdated = gm.PhotoUpdated;
                if (gm.Email != null) this.Person.Email = gm.Email;
            }
            if (gm.GroupName!="")
            {
                this.Group = new Group() { Name = gm.GroupName, Id=gm.GroupId };
            }
            
        }

    }
}