using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChumsApiCore
{
    public class Utils
    {
        public static List<string> GetInclude(HttpContext context)
        {
            string include = context.Request.Query["include"].ToString();
            if (include == null || include == "") return new List<string>();
            else return new List<string>(include.Split(','));
        }
    }
}
