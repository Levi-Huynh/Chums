using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChumsApiCore.Models
{
    public class Person
    {
        internal int ChurchId;
        private string setPhotoUrl = null;

        public int Id { get; set; }
        public Nullable<int> CampusId { get; set; }
        public string DisplayName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string NickName { get; set; }
        public string Prefix { get; set; }
        public string Suffix { get; set; }
        public Nullable<DateTime> BirthDate { get; set; }
        public string Gender { get; set; }
        public string MaritalStatus { get; set; }
        public Nullable<DateTime> Anniversary { get; set; }
        public string MembershipStatus { get; set; }
        public string HomePhone { get; set; }
        public string MobilePhone { get; set; }
        public string WorkPhone { get; set; }
        public string Email { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Photo
        {
            get
            {
                if (setPhotoUrl != null) return setPhotoUrl;
                if (PhotoUpdated == null || PhotoUpdated == DateTime.MinValue) return "/images/sample-profile.png";
                else return $"/content/c/{ChurchId}/p/{Id}.png?dt={PhotoUpdated.Value.ToString("yyyyMMddHHmmss")}";
            }
            set
            {
                setPhotoUrl = value;
            }
        }


        public Nullable<DateTime> PhotoUpdated { get; set; }

        public List<FormSubmission> FormSubmissions { get; set; }


        public Person()
        {
        }

        public Person(ChurchLib.Person p)
        {
            this.Id = p.Id;
            this.ChurchId = p.ChurchId;
            if (p.DisplayName != "") this.DisplayName = p.DisplayName;
            if (!p.IsFirstNameNull) this.FirstName = p.FirstName;
            if (!p.IsLastNameNull) this.LastName = p.LastName;
            if (!p.IsMiddleNameNull) this.MiddleName = p.MiddleName;
            if (!p.IsNickNameNull) this.NickName = p.NickName;
            if (!p.IsPrefixNull) this.Prefix = p.Prefix;
            if (!p.IsSuffixNull) this.Suffix = p.Suffix;
            if (!p.IsBirthDateNull) this.BirthDate = p.BirthDate;
            if (!p.IsGenderNull) this.Gender = p.Gender;
            if (!p.IsMaritalStatusNull) this.MaritalStatus = p.MaritalStatus;
            if (!p.IsAnniversaryNull) this.Anniversary = p.Anniversary;
            if (!p.IsMembershipStatusNull) this.MembershipStatus = p.MembershipStatus;
            if (!p.IsHomePhoneNull) this.HomePhone = p.HomePhone;
            if (!p.IsMobilePhoneNull) this.MobilePhone = p.MobilePhone;
            if (!p.IsWorkPhoneNull) this.WorkPhone = p.WorkPhone;
            if (!p.IsEmailNull) this.Email = p.Email;
            if (!p.IsAddress1Null) this.Address1 = p.Address1;
            if (!p.IsAddress2Null) this.Address2 = p.Address2;
            if (!p.IsCityNull) this.City = p.City;
            if (!p.IsStateNull) this.State = p.State;
            if (!p.IsZipNull) this.Zip = p.Zip;
            if (!p.IsPhotoUpdatedNull) this.PhotoUpdated = p.PhotoUpdated;
        }

    }
}
