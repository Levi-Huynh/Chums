using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class Group
    {
        public int MemberCount { get; set; }

        public static Group GetExtended(DataRow row)
        {
            Group g = new Group(row);
            if (row.Table.Columns.Contains("MemberCount")) g.MemberCount = (Convert.IsDBNull(row["MemberCount"])) ? 0 : Convert.ToInt32(row["MemberCount"]);
            return g;
        }
    }
}
