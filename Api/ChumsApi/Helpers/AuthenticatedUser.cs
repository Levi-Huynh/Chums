using Microsoft.AspNetCore.Http;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChumsApiCore.Helpers
{
    public class AuthenticatedUser
    {

        public string Guid { get; set; }
        public int PersonId { get; set; }
        public int ChurchId { get; set; }
        public Hashtable Permissions { get; set; }

        public bool CheckAccess(string contentType, string action)
        {
            if (this.Permissions != null)
            {
                string key = contentType + "_" + action;
                return (Permissions.ContainsKey(key));
            }
            return false;
        }

        public void RequireAccess(HttpContext context, string contentType, string action)
        {
            if (!CheckAccess(contentType, action)) DenyAccess(context);
        }

        public static void DenyAccess(HttpContext context)
        {
            context.Response.StatusCode = 401;
            context.Response.WriteAsync("401 - Access Denied").Wait();
            context.Response.CompleteAsync().Wait();
        }

    }
}
