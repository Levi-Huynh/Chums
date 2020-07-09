using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class Campus
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        
        public Campus()
        {
        }

        public Campus(ChurchLib.Campus c)
        {
            this.Id = c.Id;
            this.Name = c.Name;
            if (!c.IsAddress1Null) this.Address1 = c.Address1;
            if (!c.IsAddress2Null) this.Address2 = c.Address2;
            if (!c.IsCityNull) this.City = c.City;
            if (!c.IsStateNull) this.State = c.State;
            if (!c.IsZipNull) this.Zip = c.Zip;

        }

    }
}