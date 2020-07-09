using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string ResetGuid { get; set; }
        public string ApiToken { get; set; }
        public List<UserMapping> Mappings { get; set; }


        public User()
        {

        }

        public User(MasterLib.User u)
        {
            this.Id = u.Id;
            this.Email = u.Email;
            this.Name = u.Name;
            this.ResetGuid = u.ResetGuid;
        }



    }
}