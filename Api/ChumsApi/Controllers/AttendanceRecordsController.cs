using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;


namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AttendanceRecordsController : ControllerBase
    {
        [Route("Groups")]
        [HttpGet]
        public List<Models.AttendanceRecord> Groups()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);

            ChurchLib.AttendanceRecords records = ChurchLib.AttendanceRecords.LoadGroups(au.ChurchId);
            List<Models.AttendanceRecord> result = new List<Models.AttendanceRecord>();
            foreach (ChurchLib.AttendanceRecord ar in records) result.Add(new Models.AttendanceRecord(ar));
            return result;
        }

        // GET: api/AttendanceRecords
        [HttpGet]
        public List<Models.AttendanceRecord> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);

            ChurchLib.AttendanceRecords attendanceRecords = null;
            if (HttpContext.Request.Query["personId"].ToString() != "")
            {
                au.RequireAccess(HttpContext, "Attendance", "View");
                int personId = Convert.ToInt32(HttpContext.Request.Query["personId"].ToString());
                attendanceRecords = ChurchLib.AttendanceRecords.LoadForPerson(personId);
            } else
            {
                au.RequireAccess(HttpContext, "Attendance", "View Summary");
                int campusId = Convert.ToInt32(HttpContext.Request.Query["CampusId"].ToString());
                int serviceId = Convert.ToInt32(HttpContext.Request.Query["ServiceId"].ToString());
                int serviceTimeId = Convert.ToInt32(HttpContext.Request.Query["ServiceTimeId"].ToString());
                string categoryName = HttpContext.Request.Query["CategoryName"].ToString();
                int groupId = Convert.ToInt32(HttpContext.Request.Query["GroupId"].ToString());
                DateTime startDate = Convert.ToDateTime(HttpContext.Request.Query["StartDate"].ToString());
                DateTime endDate = Convert.ToDateTime(HttpContext.Request.Query["EndDate"].ToString());
                string groupBy = HttpContext.Request.Query["GroupBy"].ToString();
                bool trend = Convert.ToBoolean(HttpContext.Request.Query["Trend"].ToString());
                attendanceRecords = ChurchLib.AttendanceRecords.LoadAttendance(au.ChurchId, campusId, serviceId, serviceTimeId, categoryName, groupId, startDate, endDate, groupBy, trend);
            }

            List<Models.AttendanceRecord> result = new List<Models.AttendanceRecord>();
            foreach (ChurchLib.AttendanceRecord ar in attendanceRecords) result.Add(new Models.AttendanceRecord(ar));
            return result;
        }

    }
}
