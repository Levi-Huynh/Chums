using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class DonationSummary
    {
        public int Week { get; set; }
        public double TotalAmount { get; set; }
        public Fund Fund { get; set; }

        public DonationSummary()
        {

        }

        public DonationSummary(ChurchLib.DonationSummary ds)
        {
            this.Week = ds.Week;
            this.TotalAmount = ds.TotalAmount;
            this.Fund = new Fund() { Name = ds.FundName };

        }

    }
}