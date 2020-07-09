using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class People
    {

        public static People LoadAttendance(int churchId, int campusId, int serviceId, int serviceTimeId, string categoryName, int groupId, DateTime startDate, DateTime endDate)
        {
            List<MySqlParameter> parameters = new List<MySqlParameter>();
            parameters.Add(new MySqlParameter("@ChurchId", churchId));
            parameters.Add(new MySqlParameter("@StartDate", startDate));
            parameters.Add(new MySqlParameter("@EndDate", endDate));
            string sql = "SELECT p.Id, p.FirstName, p.MiddleName, p.LastName, p.NickName, p.PhotoUpdated"
                + " FROM VisitSessions vs"
                + " INNER JOIN Visits v on v.Id = vs.VisitId"
                + " INNER JOIN Sessions s on s.Id = vs.SessionId"
                + " INNER JOIN People p on p.id = v.PersonId"
                + " INNER JOIN Groups g on g.id = s.GroupId"
                + " LEFT OUTER JOIN ServiceTimes st on st.Id = s.ServiceTimeId"
                + " LEFT OUTER JOIN Services ser on ser.Id = st.ServiceId"
                + " WHERE p.ChurchId = @ChurchId AND v.VisitDate BETWEEN @StartDate AND @EndDate";
            if (campusId > 0)
            {
                sql += " AND ser.CampusId=@CampusId";
                parameters.Add(new MySqlParameter("@CampusId", campusId));
            }
            if (serviceId > 0)
            {
                sql += " AND ser.Id=@ServiceId";
                parameters.Add(new MySqlParameter("@ServiceId", serviceId));
            }
            if (serviceTimeId > 0)
            {
                sql += " AND st.Id=@ServiceTimeId";
                parameters.Add(new MySqlParameter("@ServiceTimeId", serviceTimeId));
            }
            if (categoryName!="")
            {
                sql += " AND g.CategoryName=@CategoryName";
                parameters.Add(new MySqlParameter("@CategoryName", categoryName));
            }
            if (groupId > 0)
            {
                sql += " AND g.Id=@GroupId";
                parameters.Add(new MySqlParameter("@GroupId", groupId));
            }
            sql += " GROUP BY p.Id, p.FirstName, p.MiddleName, p.LastName, p.NickName, p.PhotoUpdated";
            return Load(sql, CommandType.Text, parameters.ToArray());
        }

        public static People Search(int churchId, string term)
        {
            return Load("SELECT * FROM People WHERE ChurchId=@ChurchId AND concat(IFNULL(FirstName,''), ' ', IFNULL(MiddleName,''), ' ', IFNULL(NickName,''), ' ', IFNULL(LastName,'')) LIKE @Term LIMIT 100", CommandType.Text, new MySqlParameter[] { 
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@Term", "%" + term.Replace(" ", "%") + "%")
            });
        }

        public static People SearchPhone(int churchId, int number)
        {
            return Load("SELECT * FROM People WHERE ChurchId=@ChurchId AND (REPLACE(HomePhone,'-','') LIKE @PhoneNumber OR REPLACE(WorkPhone,'-','') LIKE @PhoneNumber OR REPLACE(MobilePhone,'-','') LIKE @PhoneNumber) LIMIT 100", CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@PhoneNumber", "%" + number.ToString() + "%")
            });
        }

        public People GetActive()
        {
            People result = new People();
            foreach (Person p in this) if (!p.Removed) result.Add(p);
            return result;
        }



    }
}
