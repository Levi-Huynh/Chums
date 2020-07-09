using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;


namespace ChurchLib
{
    public partial class Answers
    {
        public static Answers LoadByFormSubmissionIds(int churchId, int[] formSubmissionIds)
        {
            if (formSubmissionIds.Length == 0) return new Answers();
            return Load("SELECT * FROM Answers WHERE ChurchId=@ChurchId AND FormSubmissionId IN (" + String.Join(",", formSubmissionIds) + ")", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId) });
        }
    }
}
