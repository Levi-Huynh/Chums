using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {

        [Route("{contentType}/{contentId}")]
        [HttpGet]
        public List<Models.Note> Get(string contentType, int contentId)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "People", "View Notes");

            ChurchLib.Notes notes = ChurchLib.Notes.Load(au.ChurchId, contentType, contentId);
            List<Models.Note> result = new List<Models.Note>();
            foreach (ChurchLib.Note n in notes) result.Add(new Models.Note(n));
            return result;
        }

        [HttpPost]
        public int[] Post([FromBody]List<Models.Note> notes)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "People", "Edit Notes");

            ChurchLib.Notes dbNotes = new ChurchLib.Notes();
            foreach (Models.Note note in notes)
            {
                ChurchLib.Note dbNote = ConvertToDb(note, au);
                dbNotes.Add(dbNote);
            }
            VerifyChurchIds(dbNotes, au.ChurchId);
            dbNotes.SaveAll();
            return dbNotes.GetIds();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Notes", "Edit");
            ChurchLib.Note.Delete(id, au.ChurchId);
        }


        private ChurchLib.Note ConvertToDb(Models.Note n, Helpers.AuthenticatedUser au)
        {
            ChurchLib.Note db = new ChurchLib.Note() { ChurchId = au.ChurchId };
            db.Id = n.Id;
            if (n.AddedBy == null || n.AddedBy==0) db.AddedBy = au.PersonId; else db.AddedBy = n.AddedBy.Value;
            if (n.DateAdded == null) db.DateAdded = DateTime.UtcNow; else db.DateAdded = DateTime.Now;
            db.ContentId = n.ContentId;
            db.ContentType = n.ContentType;
            db.Contents = n.Contents;
            return db;
        }

        private void VerifyChurchIds(ChurchLib.Notes notes, int churchId)
        {
            List<int> ids = new List<int>(notes.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.Note n in ChurchLib.Notes.Load(ids.ToArray(), churchId)) if (n.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

    }
}
