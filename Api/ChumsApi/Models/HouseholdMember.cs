using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class HouseholdMember
    {
        public int Id { get; set; }
        public int HouseholdId { get; set; }
        public int PersonId { get; set; }
        public string Role { get; set; }
        public Person Person { get; set; }
        public Household Household { get; set; }

        public HouseholdMember()
        {

        }

        public HouseholdMember(ChurchLib.HouseholdMember hm)
        {
            this.Id = hm.Id;
            this.HouseholdId = hm.HouseholdId;
            this.PersonId = hm.PersonId;
            this.Role = hm.Role;
            if (hm.DisplayName != "")
            {
                this.Person = new Person() { DisplayName = hm.DisplayName, Id = hm.PersonId, ChurchId=hm.ChurchId };
                if (hm.PhotoUpdated != DateTime.MinValue) this.Person.PhotoUpdated = hm.PhotoUpdated;
                if (hm.LastName != null && hm.LastName != "") this.Person.LastName = hm.LastName;
            }
            /*
            if (hm.HouseholdName != "")
            {
                this.Household = new Househol() { Name = hm.HouseholdName, Id = hm.HouseholdId };
            }*/
        }

    }
}