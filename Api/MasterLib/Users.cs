using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;


namespace MasterLib
{
    public partial class Users: List<User>
    {
        public static void RemoveUnmapped()
        {
            DbHelper.ExecuteNonQuery("DELETE FROM Users WHERE ID NOT IN (SELECT UserId FROM UserMappings WHERE UserId IS NOT NULL)", CommandType.Text, null);
        }

    }
}
