using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class RoleMembers
    {
        public static RoleMembers ConvertFromDtExtended(DataTable dt)
        {
            RoleMembers result = new RoleMembers();
            foreach (DataRow row in dt.Rows) result.Add(RoleMember.GetExtended(row));
            return result;
        }

        public static RoleMembers LoadByRoleIdExtended(int churchId, int roleId)
        {
            return LoadExtended("SELECT rm.*, p.PhotoUpdated, p.FirstName, p.LastName, p.NickName, p.Email FROM RoleMembers rm INNER JOIN People p on p.Id=rm.PersonId WHERE rm.ChurchId=@ChurchId AND rm.RoleId=@RoleId ORDER BY p.LastName, p.FirstName", CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@RoleId", roleId)
            });
        }

        public static RoleMembers LoadByPersonIdExtended(int churchId, int personId)
        {
            return LoadExtended("SELECT rm.*, r.Name as RoleName FROM RoleMembers rm INNER JOIN Roles r on r.Id=rm.RoleId WHERE rm.ChurchId=@ChurchId AND rm.PersonId=@PersonId ORDER BY r.Name", CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@PersonId", personId)
            });
        }

        public static RoleMembers LoadExtended(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDtExtended(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }

    }
}
