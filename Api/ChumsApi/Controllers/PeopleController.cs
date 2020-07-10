using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChumsApiCore.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PeopleController : ControllerBase
    {
        // GET: People
        [HttpGet]
        public List<Models.Person> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);

            ChurchLib.People people = ChurchLib.People.LoadAll().GetActive();
            List<Models.Person> result = new List<Models.Person>();
            foreach (ChurchLib.Person p in people) result.Add(new Models.Person(p));
            return result;
        }

        // GET: People/5
        [HttpGet("{id}")]
        public Models.Person Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            ChurchLib.Person p = ChurchLib.Person.Load(id, au.ChurchId);
            Models.Person result = null;
            if (p.ChurchId == au.ChurchId && !p.Removed)
            {
                result = new Models.Person(p);
                if (true) AppendFormSubmissions(au, p, result);
            }
            return result;
        }

        private void AppendFormSubmissions(Helpers.AuthenticatedUser au, ChurchLib.Person person, Models.Person result)
        {
            
            ChurchLib.FormSubmissions submissions = ChurchLib.FormSubmissions.Load(au.ChurchId, "person", person.Id);
            if (submissions.Count > 0)
            {
                ChurchLib.Forms forms = ChurchLib.Forms.Load(submissions.GetFormIds(), au.ChurchId);

                result.FormSubmissions = new List<Models.FormSubmission>();
                foreach (ChurchLib.FormSubmission submission in submissions)
                {
                    ChurchLib.Form form = forms.GetById(submission.FormId);
                    if (form != null)
                    {
                        Models.FormSubmission fs = new Models.FormSubmission(submission);
                        fs.Form = new Models.Form(form);
                        result.FormSubmissions.Add(fs);
                    }
                }
            }

        }

        [Route("Photos")]
        [HttpPost]
        public string[] PostPhoto([FromBody] List<Models.Photo> photos)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "People", "Edit");
            List<string> result = new List<string>();
            foreach (Models.Photo photo in photos)
            {
                if (photo.Url.StartsWith("data:image/png;base64,")) SavePhoto(ChurchLib.Person.Load(photo.Id, au.ChurchId), photo.Url);
                result.Add($"/content/c/{au.ChurchId}/p/{photo.Id}.png?dt={DateTime.UtcNow.ToString("yyyyMMddHHmmss")}");
            }
            return result.ToArray();
        }

        private void SavePhoto(ChurchLib.Person p, string url)
        {
            if (p != null)
            {
                string[] parts = url.Split(',');
                byte[] bytes = Convert.FromBase64String(parts[1]);
                string path = $"content/c/{p.ChurchId}/p/{p.Id}.png";
                ChurchLib.Aws.S3Helper.WriteBytes(path, bytes, "image/png");
                p.PhotoUpdated = DateTime.UtcNow;
                p.Save();
            }
        }


        // POST: People
        [HttpPost]
        public int[] Post([FromBody]List<Models.Person> people)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "People", "Edit");

            ChurchLib.People dbPeople = new ChurchLib.People();
            foreach (Models.Person person in people)
            {
                ChurchLib.Person dbPerson = ConvertToDb(person, au);
                dbPeople.Add(dbPerson);
            }
            VerifyChurchIds(dbPeople, au.ChurchId);
            dbPeople.SaveAll();
            //Check for photos
            for (int i=0;i<people.Count;i++)
            {
                string photoUrl = people[i].Photo;
                if (photoUrl!=null && photoUrl.StartsWith("data:image/png;base64,"))
                {
                    ChurchLib.Person dbPerson = dbPeople[i];
                    SavePhoto(dbPerson, photoUrl);
                }
            }
            return dbPeople.GetIds();
        }

        private ChurchLib.Person ConvertToDb(Models.Person p, Helpers.AuthenticatedUser au)
        {
            ChurchLib.Person db = new ChurchLib.Person() { ChurchId = au.ChurchId };
            db.Id = p.Id;
            if (p.FirstName == null) db.IsFirstNameNull = true; else db.FirstName = p.FirstName;
            if (p.LastName == null) db.IsLastNameNull = true; else db.LastName = p.LastName;
            if (p.MiddleName == null) db.IsMiddleNameNull = true; else db.MiddleName = p.MiddleName;
            if (p.NickName == null) db.IsNickNameNull = true; else db.NickName = p.NickName;
            if (p.Prefix == null) db.IsPrefixNull = true; else db.Prefix = p.Prefix;
            if (p.Suffix == null) db.IsSuffixNull = true; else db.Suffix = p.Suffix;
            if (p.BirthDate == null) db.IsBirthDateNull = true; else db.BirthDate = p.BirthDate.Value;
            if (p.Gender == null) db.IsGenderNull = true; else db.Gender = p.Gender;
            if (p.MaritalStatus == null) db.IsMaritalStatusNull = true; else db.MaritalStatus = p.MaritalStatus;
            if (p.Anniversary == null) db.IsAnniversaryNull = true; else db.Anniversary = p.Anniversary.Value;
            if (p.MembershipStatus == null) db.IsMembershipStatusNull = true; else db.MembershipStatus = p.MembershipStatus;
            if (p.HomePhone == null) db.IsHomePhoneNull = true; else db.HomePhone = p.HomePhone;
            if (p.MobilePhone == null) db.IsMobilePhoneNull = true; else db.MobilePhone = p.MobilePhone;
            if (p.WorkPhone == null) db.IsWorkPhoneNull = true; else db.WorkPhone = p.WorkPhone;
            if (p.Email == null) db.IsEmailNull = true; else db.Email = p.Email;
            if (p.Address1 == null) db.IsAddress1Null = true; else db.Address1 = p.Address1;
            if (p.Address2 == null) db.IsAddress2Null = true; else db.Address2 = p.Address2;
            if (p.City == null) db.IsCityNull = true; else db.City = p.City;
            if (p.State == null) db.IsStateNull = true; else db.State = p.State;
            if (p.Zip == null) db.IsZipNull = true; else db.Zip = p.Zip;
            if (p.PhotoUpdated == null) db.IsPhotoUpdatedNull = true; else db.PhotoUpdated = p.PhotoUpdated.Value;
            return db;
        }


        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Groups", "Edit");
            ChurchLib.Person p = ChurchLib.Person.Load(id, au.ChurchId);
            if (p.ChurchId == au.ChurchId)
            {
                p.Removed = true;
                p.Save();
            }
        }

        //[Route("Photos/{id}")]
        [HttpDelete("Photos/{id}")]
        public void DeletePhoto(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "People", "Edit");
            ChurchLib.Person p = ChurchLib.Person.Load(id, au.ChurchId);
            if (p != null)
            {
                p.IsPhotoUpdatedNull = true;
                p.Save();
            }
        }


        [Route("Search")]
        [HttpGet]
        public List<Models.Person> Search()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            string term = HttpContext.Request.Query["term"].ToString();
            ChurchLib.People people = ChurchLib.People.Search(au.ChurchId, term).GetActive();
            List<Models.Person> result = new List<Models.Person>();
            foreach (ChurchLib.Person p in people) result.Add(new Models.Person(p));
            return result;
        }

        [Route("Search/Phone")]
        [HttpGet]
        public List<Models.Person> SearchPhone()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            int number = Convert.ToInt32(HttpContext.Request.Query["number"].ToString());
            ChurchLib.People people = ChurchLib.People.SearchPhone(au.ChurchId, number).GetActive();
            List<Models.Person> result = new List<Models.Person>();
            foreach (ChurchLib.Person p in people) result.Add(new Models.Person(p));
            return result;
        }

        [Route("Attendance")]
        [HttpGet]
        public List<Models.Person> Attendance()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Attendance", "View");

            int campusId = Convert.ToInt32(HttpContext.Request.Query["CampusId"].ToString());
            int serviceId = Convert.ToInt32(HttpContext.Request.Query["ServiceId"].ToString());
            int serviceTimeId = Convert.ToInt32(HttpContext.Request.Query["ServiceTimeId"].ToString());
            string categoryName = HttpContext.Request.Query["CategoryName"].ToString();
            int groupId = Convert.ToInt32(HttpContext.Request.Query["GroupId"].ToString());
            DateTime startDate = Convert.ToDateTime(HttpContext.Request.Query["StartDate"].ToString());
            DateTime endDate = Convert.ToDateTime(HttpContext.Request.Query["EndDate"].ToString());


            ChurchLib.People people = ChurchLib.People.LoadAttendance(au.ChurchId, campusId, serviceId, serviceTimeId, categoryName, groupId, startDate, endDate);
            List<Models.Person> result = new List<Models.Person>();
            foreach (ChurchLib.Person p in people) result.Add(new Models.Person(p));
            return result;
        }

        private void VerifyChurchIds(ChurchLib.People people, int churchId)
        {
            List<int> ids = new List<int>(people.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.Person p in ChurchLib.People.Load(ids.ToArray(), churchId)) if (p.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }
    }
}