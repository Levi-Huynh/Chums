using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterLib
{
    public partial class UserMapping
    {
        public string ChurchName { get; set; }

        public static UserMapping GetExtended(DataRow row)
        {
            UserMapping m = new UserMapping(row);
            if (row.Table.Columns.Contains("ChurchName")) m.ChurchName = Convert.ToString(row["ChurchName"]);
            return m;
        }


	}
}
