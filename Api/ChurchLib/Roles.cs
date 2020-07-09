using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class Roles
    {
        public static Roles LoadAll(int churchId)
        {
            return Load("SELECT * FROM Roles WHERE ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }
    }
}
