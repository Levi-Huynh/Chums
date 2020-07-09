using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class FormSubmissions
    {
        public int[] GetFormIds()
        {
            List<int> result = new List<int>();
            foreach (FormSubmission fs in this) if (!result.Contains(fs.FormId)) result.Add(fs.FormId);
            return result.ToArray();
        }

        public static FormSubmissions Load(int churchId, string contentType, int contentId)
        {
            return Load("SELECT * FROM FormSubmissions WHERE ChurchId=@ChurchId AND ContentType=@ContentType AND ContentId=@ContentId", CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@ContentType", contentType),
                new MySqlParameter("@ContentId", contentId)
            });
        }

        public static FormSubmissions Load(int churchId, int formId, string contentType, int contentId)
        {
            return Load("SELECT * FROM FormSubmissions WHERE ChurchId=@ChurchId AND FormId=@FormId AND ContentType=@ContentType AND ContentId=@ContentId", CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@FormId", formId),
                new MySqlParameter("@ContentType", contentType),
                new MySqlParameter("@ContentId", contentId)
            });
        }

    }
}
