using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class Campuses
    {
        public static Campuses LoadByChurchId(int churchId)
        {
            return Load("SELECT * FROM Campuses WHERE ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }

        public Campuses GetActive()
        {
            Campuses result = new Campuses();
            foreach (Campus c in this) if (!c.Removed) result.Add(c);
            return result;
        }

    }
}
