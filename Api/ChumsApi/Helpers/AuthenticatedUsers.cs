using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Collections;
using System.Web;

namespace ChumsApiCore.Helpers
{
    public class AuthenticatedUsers: List<AuthenticatedUser>
    {
        public static AuthenticatedUsers All = new AuthenticatedUsers();
        public AuthenticatedUser GetByGuid(string guid)
        {
            AuthenticatedUser result = null;
            foreach (AuthenticatedUser user in this) if (user.Guid == guid) result = user;
            if (result == null)
            {
                MasterLib.User user = MasterLib.User.LoadByResetGuid(guid);
                if (user != null)
                {
                    MasterLib.UserMappings mappings = MasterLib.UserMappings.LoadByUserIdExtended(user.Id);
                    if (mappings.Count > 0)
                    {
                        result = AuthenticatedUsers.Add(user, mappings);
                    }
                }
            }
            return result;
        }

        public static AuthenticatedUser RequireAccess(Microsoft.AspNetCore.Http.HttpContext context, string contentType = "", string action = "")
        {
            string authGuid = context.Request.Headers["Authorization"][0].Split(' ')[1];
            AuthenticatedUser au = All.GetByGuid(authGuid);
            bool accessGranted = true;
            if (au == null) accessGranted = false;
            else if (contentType != "") accessGranted = au.CheckAccess(contentType, action);
            if (!accessGranted) AuthenticatedUser.DenyAccess(context);

            return au;
        }


        /*
        public static AuthenticatedUser RequireAccess(string[] roles)
        {
            System.Web.HttpContext context = System.Web.HttpContext.Current;
            string authGuid = context.Request.Headers["Authorization"].Split(' ')[1];
            AuthenticatedUser au = All.GetByGuid(authGuid);
            if (au == null)
            {
                context.Response.StatusCode = 401;
                context.Response.Write("401 - Access Denied");
                context.Response.End();
            }
            return au;
        }*/


        public static AuthenticatedUser Add(MasterLib.User user, MasterLib.UserMappings mappings)
        {
            Helpers.AuthenticatedUser au = new Helpers.AuthenticatedUser();
            au.ChurchId = mappings[0].ChurchId;
            au.Guid = user.ResetGuid;
            au.PersonId = mappings[0].PersonId;
            au.Permissions = ChurchLib.RolePermissions.LoadByPersonId(au.ChurchId, au.PersonId).ToHashtable();

            if (!Helpers.AuthenticatedUsers.All.Contains(au)) Helpers.AuthenticatedUsers.All.Add(au);
            user.LastLogin = DateTime.UtcNow;
            user.Save();
            return au;
        }
    }
}
