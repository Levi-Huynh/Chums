using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FormsController : ControllerBase
    {
        [HttpGet]
        public List<Models.Form> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Forms", "View");

            ChurchLib.Forms forms = null;
            if (HttpContext.Request.Query["contentType"].ToString() != "")
            {
                forms = ChurchLib.Forms.LoadByContentType(au.ChurchId, HttpContext.Request.Query["contentType"].ToString());
            }
            else forms = ChurchLib.Forms.LoadByChurchId(au.ChurchId);
            forms=forms.GetActive();
            List<Models.Form> result = new List<Models.Form>();
            foreach (ChurchLib.Form form in forms) result.Add(new Models.Form(form));
            return result;
        }

        [HttpGet("{id}")]
        public Models.Form Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Forms", "View");
            ChurchLib.Form f = ChurchLib.Form.Load(id, au.ChurchId);
            if (f.ChurchId == au.ChurchId && !f.Removed) return new Models.Form(f); else return null;
        }

        [HttpPost]
        public int[] Post([FromBody]List<Models.Form> forms)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Forms", "Edit");

            ChurchLib.Forms dbForms = new ChurchLib.Forms();
            foreach (Models.Form form in forms)
            {
                ChurchLib.Form dbForm = ConvertToDb(form, au);
                dbForms.Add(dbForm);
            }
            VerifyChurchIds(dbForms, au.ChurchId);
            dbForms.SaveAll();
            return dbForms.GetIds();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Forms", "Edit");
            ChurchLib.Form f = ChurchLib.Form.Load(id, au.ChurchId);
            if (f.ChurchId == au.ChurchId)
            {
                f.Removed = true;
                f.Save();
            }
        }

        private ChurchLib.Form ConvertToDb(Models.Form f, Helpers.AuthenticatedUser au)
        {
            ChurchLib.Form db = new ChurchLib.Form() { ChurchId = au.ChurchId, Id = f.Id, Name = f.Name, ModifiedTime=DateTime.UtcNow, ContentType=f.ContentType };
            if (f.CreatedTime == null || f.CreatedTime == DateTime.MinValue) f.CreatedTime = f.ModifiedTime;
            return db;
        }

        private void VerifyChurchIds(ChurchLib.Forms forms, int churchId)
        {
            List<int> ids = new List<int>(forms.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.Form f in ChurchLib.Forms.Load(ids.ToArray(), churchId)) if (f.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}
