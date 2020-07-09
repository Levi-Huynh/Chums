using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using MySql.Data.MySqlClient;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ChurchController : ControllerBase
    {
        [HttpDelete]
        public void Delete()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Admin", "Delete Church");
            string[] files = ChurchLib.Aws.S3Helper.ListFiles("content/c/" + au.ChurchId + "/");
            ChurchLib.Aws.S3Helper.DeleteFiles(files);
            //ChurchLib.Aws.S3Helper.DeleteFile("content/c/" + au.ChurchId);
            ChurchLib.DbHelper.ExecuteNonQuery("deleteChurch", CommandType.StoredProcedure, new MySqlParameter[] { new MySqlParameter("churchId", au.ChurchId) });
            foreach(MasterLib.UserMapping mapping in MasterLib.UserMappings.LoadByChurchId(au.ChurchId)) MasterLib.UserMapping.Delete(au.ChurchId);
            MasterLib.Church.Delete(au.ChurchId);
            MasterLib.Users.RemoveUnmapped();
        }
    }
}
