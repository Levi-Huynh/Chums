using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class UserMapping
    {
        public int UserId { get; set; }
        public int ChurchId { get; set; }
        public int PersonId { get; set; }
        public Church Church { get; set; }

        public UserMapping()
        {
        }

        public UserMapping(MasterLib.UserMapping m)
        {
            this.UserId = m.UserId;
            this.ChurchId = m.ChurchId;
            this.PersonId = m.PersonId;
            if (m.ChurchName != "") this.Church = new Church() { Id = m.ChurchId, Name = m.ChurchName };

        }


    }
}