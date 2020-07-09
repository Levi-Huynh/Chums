using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class Household
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public Household()
        {
        }

        public Household(ChurchLib.Household h)
        {
            this.Id = h.Id;
            this.Name = h.Name;
        }

    }
}