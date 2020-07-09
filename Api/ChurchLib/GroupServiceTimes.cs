using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class GroupServiceTimes
    {

        public static GroupServiceTimes LoadAll(int churchId)
        {
            return Load("SELECT * FROM GroupServiceTimes WHERE ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }

        public static GroupServiceTimes LoadByServiceTimeIds(int[] serviceTimeIds)
        {
            if (serviceTimeIds.Length == 0) return new GroupServiceTimes();
            else return Load("SELECT * FROM GroupServiceTimes WHERE ServiceTimeId IN (" + String.Join(",", serviceTimeIds) + ")");
        }

        public int[] GetGroupIds()
        {
            List<int> result = new List<int>();
            foreach (GroupServiceTime gst in this) if (!result.Contains(gst.GroupId)) result.Add(gst.GroupId);
            return result.ToArray();
        }


        public static GroupServiceTimes ConvertFromDtExtended(DataTable dt)
        {
            GroupServiceTimes result = new GroupServiceTimes();
            foreach (DataRow row in dt.Rows) result.Add(GroupServiceTime.GetExtended(row));
            return result;
        }

        public static GroupServiceTimes LoadWithServiceNames(int churchId, int groupId)
        {
            string sql = "SELECT gst.*, concat(c.Name, ' - ', s.Name, ' - ', st.Name) as ServiceTimeName"
                + " FROM GroupServiceTimes gst"
                + " INNER JOIN ServiceTimes st on st.Id = gst.ServiceTimeId"
                + " INNER JOIN Services s on s.Id = st.ServiceId"
                + " INNER JOIN Campuses c on c.Id = s.CampusId"
                + " WHERE gst.ChurchId=@ChurchId AND gst.GroupId=@GroupId";
            return LoadExtended(sql, CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@GroupId", groupId)
            });
        }

        public static GroupServiceTimes LoadExtended(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDtExtended(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }
    }
}
