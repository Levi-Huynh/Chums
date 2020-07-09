using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class Notes
    {
        public static Notes Load(int churchId, string contentType, int contentId)
        {
            return LoadExtended("SELECT n.*, p.PhotoUpdated, p.FirstName, p.LastName, p.NickName FROM Notes n INNER JOIN People p on p.Id=n.AddedBy WHERE n.ChurchId=@ChurchId AND n.ContentType=@ContentType AND n.ContentId=@ContentId", CommandType.Text, new MySqlParameter[] { 
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@ContentType", contentType),
                new MySqlParameter("@ContentId", contentId)
            });
        }

        public static Notes ConvertFromDtExtended(DataTable dt)
        {
            Notes result = new Notes();
            foreach (DataRow row in dt.Rows) result.Add(Note.GetExtended(row));
            return result;
        }

        public static Notes LoadExtended(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDtExtended(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }


    }
}
