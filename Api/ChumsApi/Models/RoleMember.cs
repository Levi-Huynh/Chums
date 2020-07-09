using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class RoleMember
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public int PersonId { get; set; }
        public DateTime? DateAdded { get; set; }
        public int AddedBy { get; set; }
        public Person Person { get; set; }
        public Role Role { get; set; }

        public RoleMember()
        {

        }

        public RoleMember(ChurchLib.RoleMember rm)
        {
            this.Id = rm.Id;
            this.RoleId = rm.RoleId;
            this.PersonId = rm.PersonId;
            if (!rm.IsDateAddedNull) this.DateAdded = rm.DateAdded;
            if (rm.DisplayName != "")
            {
                this.Person = new Person() { DisplayName = rm.DisplayName,  Id = rm.PersonId, ChurchId=rm.ChurchId };
                if (rm.PhotoUpdated != DateTime.MinValue) this.Person.PhotoUpdated = rm.PhotoUpdated;
                if (rm.Email != null) this.Person.Email = rm.Email;
            }
            if (rm.RoleName != "")
            {
                this.Role = new Role() { Name = rm.RoleName, Id = rm.RoleId };
            }

        }

    }
}