using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class FundDonation
    {
        public int Id { get; set; }
        public int DonationId { get; set; }
        public int FundId { get; set; }
        public double Amount { get; set; }
        public Donation Donation { get; set; }


        public FundDonation()
        {
        }

        public FundDonation(ChurchLib.FundDonation fd)
        {
            this.Id = fd.Id;
            this.DonationId = fd.DonationId;
            this.FundId = fd.FundId;
            this.Amount = fd.Amount;

            if (fd.DonationDate!=null && fd.DonationDate != DateTime.MinValue)
            {
                this.Donation = new Donation() { DonationDate = fd.DonationDate, BatchId = fd.BatchId, PersonId=fd.PersonId };
                if (fd.DisplayName != null && fd.DisplayName != "") this.Donation.Person = new Person() { DisplayName = fd.DisplayName, Id=fd.PersonId };
            }

        }

    }
}