using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class RolePermission
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string ContentType { get; set; }
        public int? ContentId { get; set; }
        public string Action { get; set; }


        public RolePermission()
        {

        }

        public RolePermission(ChurchLib.RolePermission rp)
        {
            this.Id = rp.Id;
            this.RoleId = rp.RoleId;
            this.ContentType = rp.ContentType;
            if (!rp.IsContentIdNull) this.ContentId = rp.ContentId;
            this.Action = rp.Action;
        }

    }
}