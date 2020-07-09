using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class Person
    {
        public string DisplayName
        {
            get
            {
                return GetDisplayName(FirstName, LastName, NickName);
            }
        }

        public static string GetDisplayName(string firstName, string lastName, string nickName)
        {
            if (nickName.Length > 0) return $"{firstName} \"{nickName}\" {lastName}";
            else return $"{firstName} {lastName}".Trim();
        }

    }
}
