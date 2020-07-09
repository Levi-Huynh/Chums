using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class Service
    {
        public int Id { get; set; }
        public int CampusId { get; set; }
        public string Name { get; set; }
        public Campus Campus { get; set; }
        
        public Service()
        {
        }

        public Service(ChurchLib.Service s)
        {
            this.Id = s.Id;
            this.Name = s.Name;
            this.CampusId = s.CampusId;
            if (s.CampusName != null) this.Campus = new Campus() { Id = s.CampusId, Name = s.CampusName };
        }

    }
}