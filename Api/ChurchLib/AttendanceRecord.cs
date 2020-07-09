using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public class AttendanceRecord
    {
        public int CampusId;
        public int ServiceId;
        public int ServiceTimeId;
        public int GroupId;
        public string CampusName = "";
        public string ServiceName = "";
        public string ServiceTimeName = "";
        public string CategoryName = "";
        public string GroupName = "";
        public string Gender = "";
        public DateTime VisitDate = DateTime.MinValue;
        public int Week = 0;
        public int Count = 0;

        public string DisplayName
        {
            get { 
                if (GroupName!="") return GroupName;
                else if (CategoryName != "") return CategoryName;
                else if (ServiceTimeName != "") return ServiceTimeName;
                else if (ServiceName != "") return ServiceName;
                else if (CampusName != "") return CampusName;
                else if (Gender != "") return Gender;
                return "";
            }
        }

        public AttendanceRecord(DataRow row)
        {
            if (row.Table.Columns.Contains("CampusId") && !Convert.IsDBNull(row["CampusId"])) this.CampusId = Convert.ToInt32(row["CampusId"]);
            if (row.Table.Columns.Contains("ServiceId") && !Convert.IsDBNull(row["ServiceId"])) this.ServiceId = Convert.ToInt32(row["ServiceId"]);
            if (row.Table.Columns.Contains("ServiceTimeId") && !Convert.IsDBNull(row["ServiceTimeId"])) this.ServiceTimeId = Convert.ToInt32(row["ServiceTimeId"]);
            if (row.Table.Columns.Contains("GroupId") && !Convert.IsDBNull(row["GroupId"])) this.GroupId = Convert.ToInt32(row["GroupId"]);
            if (row.Table.Columns.Contains("CampusName") && !Convert.IsDBNull(row["CampusName"])) this.CampusName = Convert.ToString(row["CampusName"]);
            if (row.Table.Columns.Contains("ServiceName") && !Convert.IsDBNull(row["ServiceName"])) this.ServiceName = Convert.ToString(row["ServiceName"]);
            if (row.Table.Columns.Contains("ServiceTimeName") && !Convert.IsDBNull(row["ServiceTimeName"])) this.ServiceTimeName = Convert.ToString(row["ServiceTimeName"]);
            if (row.Table.Columns.Contains("CategoryName") && !Convert.IsDBNull(row["CategoryName"])) this.CategoryName = Convert.ToString(row["CategoryName"]);
            if (row.Table.Columns.Contains("GroupName") && !Convert.IsDBNull(row["GroupName"])) this.GroupName = Convert.ToString(row["GroupName"]);
            if (row.Table.Columns.Contains("VisitDate") && !Convert.IsDBNull(row["GroupName"])) this.VisitDate = Convert.ToDateTime(row["VisitDate"]);
            if (row.Table.Columns.Contains("Gender") && !Convert.IsDBNull(row["Gender"])) this.GroupName = Convert.ToString(row["Gender"]);
            if (row.Table.Columns.Contains("Count") && !Convert.IsDBNull(row["Count"])) this.Count = Convert.ToInt32(row["Count"]);
            if (row.Table.Columns.Contains("Week") && !Convert.IsDBNull(row["Week"])) this.Week = Convert.ToInt32(row["Week"]);
        }

    }
}
