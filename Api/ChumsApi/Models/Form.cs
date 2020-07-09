using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class Form
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ContentType { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime ModifiedTime { get; set; }

        public Form()
        {
        }

        public Form(ChurchLib.Form f)
        {
            this.Id = f.Id;
            this.Name = f.Name;
            this.ContentType = f.ContentType;
            this.CreatedTime = f.CreatedTime;
            this.ModifiedTime = f.ModifiedTime;
        }

    }
}