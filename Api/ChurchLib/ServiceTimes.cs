using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class ServiceTimes
    {
        public static ServiceTimes LoadNamesWithCampusService(int churchId)
        {
            string sql = "SELECT st.*, concat(c.name, ' - ', s.Name, ' - ', st.Name) as LongName FROM ServiceTimes st INNER JOIN Services s on s.Id=st.ServiceId INNER JOIN Campuses c on c.Id=s.CampusId WHERE s.ChurchId=@ChurchId ORDER BY c.Name, s.Name, st.Name";
            return LoadExtended(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }

        public static ServiceTimes LoadNamesWithCampusService(int churchId, int serviceId)
        {
            string sql = "SELECT st.*, concat(c.name, ' - ', s.Name, ' - ', st.Name) as LongName FROM ServiceTimes st INNER JOIN Services s on s.Id=st.ServiceId INNER JOIN Campuses c on c.Id=s.CampusId WHERE s.ChurchId=@ChurchId AND s.Id=@ServiceId ORDER BY c.Name, s.Name, st.Name";
            return LoadExtended(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId), new MySqlParameter("@ServiceId", serviceId) });
        }

        public static ServiceTimes LoadByChurchCampusService(int churchId, int campusId, int serviceId)
        {
            string sql = "SELECT st.*"
                + " FROM ServiceTimes st"
                + " LEFT OUTER JOIN Services s on s.Id=st.ServiceId"
                + " WHERE st.ChurchId = @ChurchId AND(@ServiceId=0 OR st.ServiceId=@ServiceId) AND (@CampusId = 0 OR s.CampusId = @CampusId)";
            return Load(sql, CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@CampusId", campusId),
                new MySqlParameter("@ServiceId", serviceId)
            });
        }

        public ServiceTimes GetActive()
        {
            ServiceTimes result = new ServiceTimes();
            foreach (ServiceTime st in this) if (!st.Removed) result.Add(st);
            return result;
        }

        public static ServiceTimes ConvertFromDtExtended(DataTable dt)
        {
            ServiceTimes result = new ServiceTimes();
            foreach (DataRow row in dt.Rows) result.Add(ServiceTime.GetExtended(row));
            return result;
        }

        public static ServiceTimes LoadExtended(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDtExtended(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }

    }
}
