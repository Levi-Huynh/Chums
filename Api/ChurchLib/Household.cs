using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class Household
    {
        public static Household LoadByPersonId(int personId)
        {
            return Load("SELECT h.* FROM HouseholdMembers hm INNER JOIN Households h on h.Id=hm.HouseholdId WHERE hm.PersonId = @PersonId LIMIT 1", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@PersonId", personId) });
        }
    }
}
