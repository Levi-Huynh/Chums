using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class GroupMembers
    {
        public static GroupMembers LoadAll(int churchId)
        {
            return Load("SELECT * FROM GroupMembers WHERE ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }

        public static GroupMembers ConvertFromDtExtended(DataTable dt)
        {
            GroupMembers result = new GroupMembers();
            foreach (DataRow row in dt.Rows) result.Add(GroupMember.GetExtended(row));
            return result;
        }

        public static GroupMembers LoadByGroupIdExtended(int churchId, int groupId)
        {
            return LoadExtended("SELECT gm.*, p.PhotoUpdated, p.FirstName, p.LastName, p.NickName, p.Email FROM GroupMembers gm INNER JOIN People p on p.Id=gm.PersonId WHERE gm.ChurchId=@ChurchId AND gm.GroupId=@GroupId ORDER BY p.LastName, p.FirstName", CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@GroupId", groupId)
            });
        }

        public static GroupMembers LoadByPersonIdExtended(int churchId, int personId)
        {
            return LoadExtended("SELECT gm.*, g.Name as GroupName FROM GroupMembers gm INNER JOIN Groups g on g.Id=gm.GroupId WHERE gm.ChurchId=@ChurchId AND gm.PersonId=@PersonId ORDER BY g.Name", CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@PersonId", personId)
            });
        }

        public static GroupMembers LoadExtended(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDtExtended(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }

    }
}
