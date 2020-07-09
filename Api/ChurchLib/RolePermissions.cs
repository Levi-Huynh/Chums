using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;
using System.Collections;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class RolePermissions
    {
        public Hashtable ToHashtable()
        {
            Hashtable result = new Hashtable();
            foreach (RolePermission rp in this)
            {
                string key = rp.ContentType + "_" + rp.Action;
                if (!result.ContainsKey(key)) result.Add(key, null);
            }
            return result;
        }

        public static RolePermissions LoadByPersonId(int churchId, int personId)
        {
            return Load("SELECT rp.* FROM RoleMembers rm INNER JOIN RolePermissions rp on rp.RoleId=rm.RoleId WHERE rm.ChurchId=@ChurchId AND rm.PersonId=@PersonId", CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@ChurchId", churchId),
                new MySqlParameter("@PersonId", personId)
            });
        }

        public RolePermissions GetByContentType(string contentType)
        {
            RolePermissions result = new RolePermissions();
            foreach (RolePermission rp in this) if (rp.ContentType == contentType) result.Add(rp);
            return result;
        }

        public RolePermissions GetByContentTypeAction(string contentType, string action)
        {
            RolePermissions result = new RolePermissions();
            foreach (RolePermission rp in this) if (rp.ContentType == contentType && rp.Action==action) result.Add(rp);
            return result;
        }

    }
}
