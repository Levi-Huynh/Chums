using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class Jobs
    {
        public static Jobs LoadByChurchId(int churchId)
        {
            return Load("SELECT * FROM Jobs WHERE ChurchId=@ChurchId ORDER BY StartTime", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }
    }
}
