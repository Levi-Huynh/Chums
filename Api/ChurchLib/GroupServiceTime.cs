using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class GroupServiceTime
    {
        public string ServiceTimeName { get; set; }

        public static GroupServiceTime GetExtended(DataRow row)
        {
            GroupServiceTime gst = new GroupServiceTime(row);
            if (row.Table.Columns.Contains("ServiceTimeName")) gst.ServiceTimeName = Convert.ToString(row["ServiceTimeName"]);
            return gst;
        }


    }
}
