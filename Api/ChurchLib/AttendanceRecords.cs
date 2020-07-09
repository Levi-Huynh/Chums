using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public class AttendanceRecords:List<AttendanceRecord>
    {

        public string[] GetDisplayNames()
        {
            List<string> result = new List<string>();
            foreach (AttendanceRecord r in this) if (!result.Contains(r.DisplayName)) result.Add(r.DisplayName);
            return result.ToArray();
        }

        public AttendanceRecords GetByDisplayName(string displayName)
        {
            AttendanceRecords result = new AttendanceRecords();
            foreach (ChurchLib.AttendanceRecord r in this) if (r.DisplayName==displayName) result.Add(r);
            return result;
        }

        public int[] GetWeeks()
        {
            List<int> result = new List<int>();
            foreach (AttendanceRecord r in this) if (!result.Contains(r.Week)) result.Add(r.Week);
            return result.ToArray();
        }

        public AttendanceRecords GetByWeek(int week)
        {
            AttendanceRecords result = new AttendanceRecords();
            foreach (ChurchLib.AttendanceRecord r in this) if (r.Week == week) result.Add(r);
            return result;
        }

        public static AttendanceRecords LoadAttendance(int churchId, int campusId, int serviceId, int serviceTimeId, string categoryName, int groupId, DateTime startDate, DateTime endDate, string groupBy, bool trend=false)
        {
            string field = GetGroupByField(groupBy);
            List<MySqlParameter> parameters = new List<MySqlParameter>();
            parameters.Add(new MySqlParameter("@ChurchId", churchId));
            parameters.Add(new MySqlParameter("@StartDate", startDate));
            parameters.Add(new MySqlParameter("@EndDate", endDate));
            string sql = "SELECT ";
            if (trend) sql += "week(v.VisitDate,0) as Week, ";
            sql += field + " as " + groupBy + ", Count(distinct(p.id)) as Count"
                + " FROM VisitSessions vs"
                + " INNER JOIN Visits v on v.Id = vs.VisitId"
                + " INNER JOIN Sessions s on s.Id = vs.SessionId"
                + " INNER JOIN People p on p.id = v.PersonId"
                + " INNER JOIN Groups g on g.id = s.GroupId"
                + " LEFT OUTER JOIN ServiceTimes st on st.Id = s.ServiceTimeId"
                + " LEFT OUTER JOIN Services ser on ser.Id = st.ServiceId"
                + " LEFT OUTER JOIN Campuses c on c.Id = ser.CampusId"
                + " WHERE p.ChurchId = @ChurchId AND v.VisitDate BETWEEN @StartDate AND @EndDate";
            if (campusId > 0)
            {
                sql += " AND ser.CampusId=@CampusId";
                parameters.Add(new MySqlParameter("@CampusId", campusId));
            }
            if (serviceId > 0)
            {
                sql += " AND ser.Id=@ServiceId";
                parameters.Add(new MySqlParameter("@ServiceId", serviceId));
            }
            if (serviceTimeId > 0)
            {
                sql += " AND st.Id=@ServiceTimeId";
                parameters.Add(new MySqlParameter("@ServiceTimeId", serviceTimeId));
            }
            if (categoryName != "")
            {
                sql += " AND g.CategoryName=@CategoryName";
                parameters.Add(new MySqlParameter("@CategoryName", categoryName));
            }
            if (groupId > 0)
            {
                sql += " AND g.Id=@GroupId";
                parameters.Add(new MySqlParameter("@GroupId", groupId));
            }
            sql += " GROUP BY ";
            if (trend) sql += "week(v.VisitDate, 0), ";
            sql += $"{field} ORDER BY ";
            if (trend) sql += "week(v.VisitDate, 0), ";
            sql += field;
            return Load(sql, CommandType.Text, parameters.ToArray());
        }

        private static string GetGroupByField(string groupBy)
        {
            string result = "c.Name";
            switch (groupBy)
            {
                case "GroupName":
                    result = "g.Name";
                    break;
                case "CampusName":
                    result = "c.Name";
                    break;
                case "ServiceName":
                    result = "ser.Name";
                    break;
                case "ServiceTimeName":
                    result = "st.Name";
                    break;
                case "CategoryName":
                    result = "g.CategoryName";
                    break;
                case "Gender":
                    result = "p.Gender";
                    break;
            }
            return result;
        }


        public static AttendanceRecords ConvertFromDt(DataTable dt)
        {
            AttendanceRecords result = new AttendanceRecords();
            foreach (DataRow row in dt.Rows) result.Add(new AttendanceRecord(row));
            return result;
        }

        public static AttendanceRecords LoadGroups(int churchId)
        {
            string sql = "SELECT * FROM ("
            + "     SELECT c.Id as CampusId, IFNULL(c.Name, 'Unassigned') as CampusName, s.Id as ServiceId, s.Name as ServiceName, st.Id as ServiceTimeId, st.Name as ServiceTimeName, g.Id as GroupId, g.CategoryName, g.Name as GroupName"
            + "     FROM Groups g"
            + "     LEFT JOIN GroupServiceTimes gst on gst.GroupId = g.Id"
            + "     LEFT JOIN ServiceTimes st on st.Id = gst.ServiceTimeId"
            + "     LEFT JOIN Services s on s.Id = st.ServiceId"
            + "     LEFT JOIN Campuses c on c.Id = s.CampusId"
            + "     WHERE(c.Id is NULL or c.ChurchId = @ChurchId) AND(g.Id IS NULL or(g.ChurchId = @ChurchId AND g.TrackAttendance = 1)) AND IFNULL(g.Removed, 0) = 0 AND IFNULL(st.Removed, 0) = 0 AND IFNULL(s.Removed, 0) = 0 AND IFNULL(c.Removed, 0) = 0"
            + "     UNION"
            + "     SELECT c2.Id as CampusId, IFNULL(c2.Name, 'Unassigned') as CampusName, s2.Id as ServiceId, s2.Name as ServiceName, st2.Id as ServiceTimeId, st2.Name as ServiceTimeName, g2.Id as GroupId, g2.CategoryName, g2.Name as GroupName"
            + "     FROM Groups g2"
            + "     RIGHT JOIN GroupServiceTimes gst2 on gst2.GroupId = g2.Id"
            + "     RIGHT JOIN ServiceTimes st2 on st2.Id = gst2.ServiceTimeId"
            + "     RIGHT JOIN Services s2 on s2.Id = st2.ServiceId"
            + "     RIGHT JOIN Campuses c2 on c2.Id = s2.CampusId"
            + "     WHERE(c2.Id is NULL or c2.ChurchId = @ChurchId) AND(g2.Id IS NULL or(g2.ChurchId = @ChurchId AND g2.TrackAttendance = 1)) AND IFNULL(g2.Removed, 0) = 0 AND IFNULL(st2.Removed, 0) = 0 AND IFNULL(s2.Removed, 0) = 0 AND IFNULL(c2.Removed, 0) = 0"
            + " ) combined"
            + " ORDER by CampusName, ServiceName, ServiceTimeName, CategoryName, GroupName";
            return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }

        public static AttendanceRecords LoadForPerson(int personId)
        {
            string sql = "SELECT v.VisitDate, c.Id as CampusId, c.Name as CampusName, ser.Id as ServiceId, ser.Name as ServiceName, st.Id as ServiceTimeId, st.Name as ServiceTimeName, g.Id as GroupId, g.CategoryName, g.Name as GroupName"
                + " FROM Visits v"
                + " INNER JOIN VisitSessions vs on vs.VisitId = v.Id"
                + " INNER JOIN Sessions s on s.Id = vs.SessionId"
                + " INNER JOIN Groups g on g.Id = s.GroupId"
                + " LEFT OUTER JOIN ServiceTimes st on st.Id = s.ServiceTimeId"
                + " LEFT OUTER JOIN Services ser on ser.Id = st.ServiceId"
                + " LEFT OUTER JOIN Campuses c on c.Id = ser.CampusId"
                + " WHERE v.PersonId = @PersonId"
                + " ORDER BY v.VisitDate desc, c.Name, ser.Name, st.Name";
            return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@PersonId", personId) });
        }

        public static AttendanceRecords Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDt(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }

    }
}
