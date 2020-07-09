using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class Groups
    {
        /*
        public static Groups LoadByServiceTimeId(int serviceTimeId)
        {
            string sql = "SELECT g.*"
                + " FROM GroupServiceTimes gst"
                + " INNER JOIN Groups g on g.Id = gst.GroupId"
                + " WHERE gst.ServiceTimeId = @ServiceTimeId";
            return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("ServiceTimeId", serviceTimeId) });
        }*/

        public Groups GetAllByCategory(string categoryName)
        {
            Groups result = new Groups();
            foreach (ChurchLib.Group group in this) if (group.CategoryName == categoryName) result.Add(group);
            return result;
        }

        public Groups GetByTrackAttendance(bool trackAttendance)
        {
            Groups result = new Groups();
            foreach (ChurchLib.Group group in this) if (group.TrackAttendance == trackAttendance) result.Add(group);
            return result;
        }

        public static Groups LoadByChurchCampusServiceTime(int churchId, int campusId, int serviceId, int serviceTimeId)
        {
            string sql = "SELECT g.Id, g.CategoryName, g.Name"
                + " FROM Groups g"
                + " LEFT OUTER JOIN GroupServiceTimes gst on gst.GroupId=g.Id"
                + " LEFT OUTER JOIN ServiceTimes st on st.Id=gst.ServiceTimeId"
                + " LEFT OUTER JOIN Services s on s.Id=st.ServiceId"
                + " WHERE g.ChurchId = @ChurchId AND (@ServiceTimeId=0 OR gst.ServiceTimeId=@ServiceTimeId) AND (@ServiceId=0 OR st.ServiceId=@ServiceId) AND (@CampusId = 0 OR s.CampusId = @CampusId)"
                + " GROUP BY g.Id, g.CategoryName, g.Name ORDER BY g.Name";

            return Load(sql, CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@CampusId", campusId),
                new MySqlParameter("@ServiceId", serviceId),
                new MySqlParameter("@ServiceTimeId", serviceTimeId)
            });
        }

        public string[] GetCategories()
        {
            List<string> result = new List<string>();
            foreach (ChurchLib.Group group in this) if (!result.Contains(group.CategoryName)) result.Add(group.CategoryName);
            return result.ToArray();
        }

        public static Groups LoadAllExtended(int churchId)
        {
            return LoadExtended("SELECT g.*, (SELECT COUNT(*) FROM GroupMembers gm WHERE gm.GroupId=g.Id) AS MemberCount FROM Groups g WHERE g.ChurchId=@ChurchId ORDER BY g.Name", CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId)
            });
        }

        public static Groups LoadByPersonId(int personId)
        {
            return Load("SELECT g.* FROM GroupMembers gm INNER JOIN Groups g on g.Id=gm.GroupId WHERE gm.PersonId=@PersonId ORDER BY g.Name", CommandType.Text, new MySqlParameter[] { 
                new MySqlParameter("@PersonId", personId)
            });
        }

        public static Groups ConvertFromDtExtended(DataTable dt)
        {
            Groups result = new Groups();
            foreach (DataRow row in dt.Rows) result.Add(Group.GetExtended(row));
            return result;
        }

        

        public static Groups LoadExtended(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDtExtended(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }

        public Groups GetActive()
        {
            Groups result = new Groups();
            foreach (Group g in this) if (!g.Removed) result.Add(g);
            return result;
        }


    }
}
