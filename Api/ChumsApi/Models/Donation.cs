using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class Donation
    {
        public int Id { get; set; }
        public int BatchId { get; set; }
        public int? PersonId { get; set; }
        public DateTime DonationDate { get; set; }
        public double Amount { get; set; }
        public string Method { get; set; }
        public string MethodDetails { get; set; }
        public string Notes { get; set; }
        public Person Person { get; set; }
        public Fund Fund { get; set; }

        public Donation()
        {
        }

        public Donation(ChurchLib.Donation d)
        {
            this.Id = d.Id;
            this.BatchId = d.BatchId;
            if (!d.IsPersonIdNull && d.PersonId != 0) {
                this.PersonId = d.PersonId;
                this.Person = new Person() { Id = d.PersonId, DisplayName = d.DisplayName, ChurchId=d.ChurchId };
            }
            if (d.FundName!=null && d.FundName!="")
            {
                this.Fund = new Fund() { Name = d.FundName };
            }
            this.DonationDate = d.DonationDate;
            this.Amount = d.Amount;
            this.Method = d.Method;
            if (!d.IsMethodDetailsNull) this.MethodDetails = d.MethodDetails;
            if (!d.IsNotesNull) this.Notes = d.Notes;

            

        }

    }
}