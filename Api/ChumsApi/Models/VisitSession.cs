using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class VisitSession
    {
        public int Id { get; set; }
        public int VisitId { get; set; }
        public int SessionId { get; set; }
        public Visit Visit { get; set; }
        public Session Session { get; set; }


        public VisitSession()
        {
        }

        public VisitSession(ChurchLib.VisitSession vs)
        {
            this.Id = vs.Id;
            this.VisitId = vs.VisitId;
            this.SessionId = vs.SessionId;

            if (vs.PersonId>0)
            {
                Visit = new Visit() { Id=vs.VisitId, PersonId=vs.PersonId };
                if (vs.DisplayName!=null)
                {
                    Visit.Person = new Person() { Id = vs.PersonId, DisplayName = vs.DisplayName };
                    if (vs.PhotoUpdated != DateTime.MinValue) Visit.Person.PhotoUpdated = vs.PhotoUpdated;
                }
            }

        }

    }
}