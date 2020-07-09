using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class HouseholdMembers
    {

        public HouseholdMembers GetAllByRole(string role)
        {
            HouseholdMembers result = new HouseholdMembers();
            foreach (HouseholdMember member in this) if (member.Role == role) result.Add(member);
            return result;
        }

        public void RemoveDuplicates()
        {
            if (this.Count == 0) return;
            int householdId = this[0].HouseholdId;
            List<int> peopleIds = new List<int>();
            foreach (HouseholdMember member in this) peopleIds.Add(member.PersonId);
            RemoveDuplicates(this[0].ChurchId, this[0].HouseholdId, peopleIds.ToArray());
        }

        public static void RemoveDuplicates(int churchId, int householdId, int[] peopleId)
        {
            string sql = "DELETE FROM HouseholdMembers WHERE ChurchId=@ChurchId AND HouseholdId<>@HouseHoldId AND PersonId IN (" + String.Join(",", peopleId) + ")";
            DbHelper.ExecuteNonQuery(sql, CommandType.Text, new MySqlParameter[] { 
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@HouseholdId", householdId)
            });

            sql = "DELETE FROM Households WHERE ChurchId=@ChurchId AND Id NOT IN (SELECT Distinct(HouseholdId) FROM HouseholdMembers WHERE HouseholdId IS NOT NULL)";
            DbHelper.ExecuteNonQuery(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }

        public static HouseholdMembers ConvertFromDtExtended(DataTable dt)
        {
            HouseholdMembers result = new HouseholdMembers();
            foreach (DataRow row in dt.Rows) result.Add(HouseholdMember.GetExtended(row));
            return result;
        }

        public static HouseholdMembers LoadByHouseholdIdExtended(int churchId, int householdId)
        {
            return LoadExtended("SELECT hm.*, p.PhotoUpdated, p.FirstName, p.LastName, p.NickName, p.BirthDate FROM HouseholdMembers hm INNER JOIN People p on p.Id=hm.PersonId and IFNULL(p.Removed,0)=0 WHERE hm.ChurchId=@ChurchId AND hm.HouseholdId=@HouseholdId", CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@HouseholdId", householdId)
            });
        }

        public static HouseholdMembers LoadExtended(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
        {
            return ConvertFromDtExtended(DbHelper.ExecuteQuery(sql, commandType, parameters));
        }
    }

}
