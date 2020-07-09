using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class DonationBatch
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime BatchDate { get; set; }
        public int DonationCount { get; set; }
        public double TotalAmount { get; set; }

        public DonationBatch()
        {
        }

        public DonationBatch(ChurchLib.DonationBatch b)
        {
            this.Id = b.Id;
            this.Name = b.Name;
            this.BatchDate = b.BatchDate;
            this.DonationCount = b.DonationCount;
            this.TotalAmount = b.TotalAmount;
        }

    }
}