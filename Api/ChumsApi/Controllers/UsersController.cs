using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [Route("Login")]
        [HttpPost]
        public Models.User Post([FromBody]Models.User cred)
        {
            Models.User result = null;
            try
            {
                MasterLib.User user = (cred.ResetGuid == null) ? MasterLib.User.Login(cred.Email, cred.Password) : MasterLib.User.LoadByResetGuid(cred.ResetGuid);
                if (user != null)
                {
                    MasterLib.UserMappings mappings = MasterLib.UserMappings.LoadByUserIdExtended(user.Id);
                    if (mappings.Count > 0)
                    {
                        user.ResetGuid = Guid.NewGuid().ToString();
                        Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.Add(user, mappings);
                        result = new Models.User(user);
                        result.ApiToken = au.Guid;
                        result.Mappings = new List<Models.UserMapping>();
                        foreach (MasterLib.UserMapping mapping in mappings) result.Mappings.Add(new Models.UserMapping(mapping));
                    }
                }
            } catch (Exception ex)
            {
                result = new Models.User();
                result.Name = ex.ToString();
            }
            return result;
        }

        [Route("Forgot")]
        [HttpPost]
        public string Forgot([FromBody] Models.User cred)
        {
            bool success = false;
            MasterLib.User user = MasterLib.User.LoadByEmail(cred.Email);
            if (user != null)
            {
                user.ResetGuid = Guid.NewGuid().ToString();
                user.Save();
                string body = "<p>Please click the <a href=\"https://chums.org/cp/login?guid=" + user.ResetGuid + "\">here</a> to reset your Chums.org password.</p>";
                ChurchLib.Aws.EmailHelper.SendEmail("support@chums.org", user.Email, "Chums.org Password Reset Request", body);
                success = true;
            }
            return "{\"emailed\": " + success.ToString().ToLower() + "}";
        }

        [Route("Register")]
        [HttpPost]
        public Models.User Register([FromBody] Models.Registration registration)
        {
            Models.User result = null;
            if (MasterLib.User.LoadByEmail(registration.Email) == null)
            {
                MasterLib.User user = CreateDbRecords(registration);
                MasterLib.UserMappings mappings = MasterLib.UserMappings.LoadByUserIdExtended(user.Id);
                user.ResetGuid = Guid.NewGuid().ToString();
                Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.Add(user, mappings);
                result = new Models.User(user);
                result.ApiToken = au.Guid;
                result.Mappings = new List<Models.UserMapping>();
                foreach (MasterLib.UserMapping mapping in mappings) result.Mappings.Add(new Models.UserMapping(mapping));
                
            }
            return result;

        }

        private static MasterLib.User CreateDbRecords(Models.Registration registration)
        {
            Models.Registration r = registration;
            MasterLib.User user = new MasterLib.User() { Email = r.Email, Name = r.FirstName + " " + r.LastName };
            user.Password = MasterLib.User.HashPassword(r.Password);
            user.Save();

            //Create the church and campus
            MasterLib.Church church = new MasterLib.Church() { Name = r.ChurchName };
            church.Save();
            ChurchLib.Campus campus = new ChurchLib.Campus() { Name = church.Name, ChurchId = church.Id };
            campus.Save();

            //Add the person and their household
            ChurchLib.Person person = new ChurchLib.Person() { CampusId = campus.Id, ChurchId = church.Id, Email = r.Email, FirstName = r.FirstName, LastName = r.LastName };
            person.Save();
            ChurchLib.Household household = new ChurchLib.Household() { ChurchId = church.Id, Name = r.LastName };
            household.Save();
            new ChurchLib.HouseholdMember() { ChurchId = church.Id, HouseholdId = household.Id, PersonId = person.Id, Role = "Head" }.Save();

            //Map the user to the person and add to Admin group
            new MasterLib.UserMapping() { ChurchId = church.Id, UserId = user.Id, PersonId = person.Id }.Save();
            ChurchLib.Role role = new ChurchLib.Role() { ChurchId = church.Id, Name = "Administrators" };
            role.Save();
            AddAllRolePermissions(church.Id, role.Id);
            new ChurchLib.RoleMember() { AddedBy = person.Id, ChurchId = church.Id, DateAdded = DateTime.UtcNow, RoleId = role.Id, PersonId = person.Id }.Save();

            //Create the General Fund
            new ChurchLib.Fund() { ChurchId = church.Id, Name = "General Fund" }.Save();

            //Create a 9:00 am, Sunday Worship Service
            ChurchLib.Service service = new ChurchLib.Service() { ChurchId = church.Id, CampusId = campus.Id, Name = "Sunday Morning" };
            service.Save();
            ChurchLib.ServiceTime serviceTime = new ChurchLib.ServiceTime() { ChurchId = church.Id, Name = "9:00 am", ServiceId = service.Id };
            serviceTime.Save();
            ChurchLib.Group group = new ChurchLib.Group() { ChurchId = church.Id, Name = "Worship Service", CategoryName = "Worship Service", TrackAttendance = true };
            group.Save();
            new ChurchLib.GroupServiceTime() { ChurchId = church.Id, GroupId = group.Id, ServiceTimeId = serviceTime.Id }.Save();
            return user;
        }

        private static void AddAllRolePermissions(int churchId, int roleId)
        {
            ChurchLib.RolePermissions p = new ChurchLib.RolePermissions();
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Attendance", Action = "Edit" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Attendance", Action = "View" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Attendance", Action = "View Summary" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Donations", Action = "Edit" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Donations", Action = "View" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Donations", Action = "View Summary" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Forms", Action = "Edit" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Forms", Action = "View" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Group Members", Action = "Edit" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Group Members", Action = "View" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Groups", Action = "Edit" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Groups", Action = "View" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Households", Action = "Edit" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "People", Action = "Edit" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "People", Action = "Edit Notes" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "People", Action = "View Notes" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Roles", Action = "Edit" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Roles", Action = "View" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Services", Action = "Edit" });
            p.Add(new ChurchLib.RolePermission() { ChurchId = churchId, RoleId = roleId, ContentType = "Admin", Action = "Import" });
            p.SaveAsync(5);
        }


    }
}