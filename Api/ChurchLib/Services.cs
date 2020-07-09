using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class Services
    {
        public static Services LoadNamesWithCampus(int churchId)
        {
            string sql = "SELECT s.*, c.Name as CampusName FROM Services s INNER JOIN Campuses c on c.Id=s.CampusId WHERE s.ChurchId=@ChurchId ORDER BY c.Name, s.Name";
            return LoadExtended(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }

        public static Services LoadByChurchCampus(int churchId, int campusId)
        {
            return Load("SELECT * FROM Services WHERE ChurchId=@ChurchId AND (@CampusId=0 OR CampusId=@CampusId)", CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@CampusId", campusId)
            });
        }

        public static Services LoadExtended(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDtExtended(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }

        public static Services ConvertFromDtExtended(DataTable dt)
        {
            Services result = new Services();
            foreach (DataRow row in dt.Rows) result.Add(Service.GetExtended(row));
            return result;
        }

        public Services GetActive()
        {
            Services result = new Services();
            foreach (Service s in this) if (!s.Removed) result.Add(s);
            return result;
        }

    }
}
