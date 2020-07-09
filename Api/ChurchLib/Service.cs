using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class Service
    {
        public string CampusName { get; set; }

        public static Service GetExtended(DataRow row)
        {
            Service s = new Service(row);
            if (row.Table.Columns.Contains("CampusName")) s.CampusName = Convert.ToString(row["CampusName"]);
            return s;
        }

    }
}
