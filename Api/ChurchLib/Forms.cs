using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class Forms
    {
        public static Forms LoadByChurchId(int churchId)
        {
            return Load("SELECT * FROM Forms WHERE ChurchId=@ChurchId ORDER BY Name", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }

        public static Forms LoadByContentType(int churchId, string contentType)
        {
            return Load("SELECT * FROM Forms WHERE ChurchId=@ChurchId AND ContentType=@ContentType ORDER BY Name", CommandType.Text, new MySqlParameter[] { 
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@ContentType", contentType)
            });
        }

        public Forms GetActive()
        {
            Forms result = new Forms();
            foreach (Form f in this) if (!f.Removed) result.Add(f);
            return result;
        }

    }
}
