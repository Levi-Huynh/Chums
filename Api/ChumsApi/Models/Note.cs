using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class Note
    {
        public int Id { get; set; }
        public string ContentType { get; set; }
        public int ContentId { get; set; }
        public int? AddedBy { get; set; }
        public DateTime? DateAdded { get; set; }
        public string Contents { get; set; }
        public Person Person { get; set; }

        public Note()
        {
        }

        public Note(ChurchLib.Note n)
        {
            this.Id = n.Id;
            this.ContentType = n.ContentType;
            this.ContentId = n.ContentId;
            this.AddedBy = n.AddedBy;
            this.DateAdded = n.DateAdded;
            this.Contents = n.Contents;
            if (n.DisplayName!=null && n.DisplayName!="")
            {
                this.Person = new Person() { Id=n.AddedBy, DisplayName = n.DisplayName, ChurchId=n.ChurchId };
                if (n.PhotoUpdated != DateTime.MinValue) Person.PhotoUpdated = n.PhotoUpdated;
            }
        }

    }
}