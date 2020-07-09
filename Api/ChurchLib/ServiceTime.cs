using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class ServiceTime
    {
        public string LongName { get; set; }

        public static ServiceTime GetExtended(DataRow row)
        {
            ServiceTime st = new ServiceTime(row);
            if (row.Table.Columns.Contains("LongName")) st.LongName = Convert.ToString(row["LongName"]);
            return st;
        }

    }
}
