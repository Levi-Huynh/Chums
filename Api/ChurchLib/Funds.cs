using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class Funds
    {

        public static Funds LoadAll(int churchId)
        {
            return Load("SELECT * FROM Funds WHERE ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }

        public Funds GetActive()
        {
            Funds result = new Funds();
            foreach (Fund f in this) if (!f.Removed) result.Add(f);
            return result;
        }

    }
}
