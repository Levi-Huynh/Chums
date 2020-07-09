using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class Fund
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public Fund()
        {
        }

        public Fund(ChurchLib.Fund f)
        {
            this.Id = f.Id;
            this.Name = f.Name;
        }

    }
}