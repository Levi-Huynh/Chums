using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<RoleMember> Members { get; set; }


        public Role()
        {
        }

        public Role(ChurchLib.Role r)
        {
            this.Id = r.Id;
            this.Name = r.Name;
        }

    }
}