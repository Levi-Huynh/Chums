using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterLib
{
    public partial class UserMappings
    {
        public static UserMappings LoadByChurchIdPersonId(int churchId, int personId)
        {
            return LoadExtended("SELECT * FROM UserMappings m WHERE ChurchId=@ChurchId AND PersonId=@PersonId", CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@PersonId", personId)
            });
        }

        public static UserMappings LoadByUserIdExtended(int userId)
        {
            return LoadExtended("SELECT m.*, c.Name as ChurchName FROM UserMappings m LEFT OUTER JOIN Churches c on c.Id=m.ChurchId WHERE m.UserId=@UserId", CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@UserId", userId)
            });
        }

        public static UserMappings ConvertFromDtExtended(DataTable dt)
        {
            UserMappings result = new UserMappings();
            foreach (DataRow row in dt.Rows) result.Add(UserMapping.GetExtended(row));
            return result;
        }

        public static UserMappings LoadExtended(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDtExtended(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }
    }
}
