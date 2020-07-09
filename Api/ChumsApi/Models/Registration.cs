using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChumsApiCore.Models
{
    public class Registration
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ChurchName { get; set; }
        public string Password { get; set; }

    }
}
