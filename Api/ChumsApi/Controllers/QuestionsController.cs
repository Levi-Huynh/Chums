using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {

        [Route("Sort/{id}/{direction}")]
        [HttpGet]
        public string Sort(int id, string direction)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Forms", "Edit");
            ChurchLib.Question question = ChurchLib.Question.Load(id, au.ChurchId);
            if (question.ChurchId==au.ChurchId)
            {
                ChurchLib.Questions questions = ChurchLib.Questions.LoadByFormId(question.FormId, au.ChurchId).GetActive().GetByParentId(question.ParentId);
                ChurchLib.Question q = questions.GetById(id);
                if (direction == "up") q.Sort = q.Sort - 3; else q.Sort = q.Sort + 3;
                questions = questions.Sort("Sort", false);
                questions.Renumber();
                questions.SaveAll();
            }
            return "[]";
        }

        [HttpGet]
        public List<Models.Question> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            ChurchLib.Questions questions = null;
            if (HttpContext.Request.Query["formId"].ToString() != "")
            {
                int formId = Convert.ToInt32(HttpContext.Request.Query["formId"].ToString());
                questions = ChurchLib.Questions.LoadByFormId(formId, au.ChurchId).GetActive();
            }
            List<Models.Question> result = new List<Models.Question>();
            foreach (ChurchLib.Question question in questions.Sort("Sort", false)) result.Add(new Models.Question(question));
            return result;
        }

        [HttpGet("{id}")]
        public Models.Question Get(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            ChurchLib.Question q = ChurchLib.Question.Load(id, au.ChurchId);
            if (q.ChurchId == au.ChurchId && !q.Removed) return new Models.Question(q); else return null;
        }

        [HttpPost]
        public int[] Post([FromBody]List<Models.Question> questions)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Forms", "Edit");

            ChurchLib.Questions dbQuestions = new ChurchLib.Questions();
            foreach (Models.Question question in questions)
            {
                ChurchLib.Question dbQuestion = ConvertToDb(question, au);
                dbQuestions.Add(dbQuestion);
            }
            VerifyChurchIds(dbQuestions, au.ChurchId);
            dbQuestions.SaveAll();
            return dbQuestions.GetIds();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Forms", "Edit");

            ChurchLib.Question question = ChurchLib.Question.Load(id, au.ChurchId);
            if (question.ChurchId==au.ChurchId)
            {
                //move any children to top level.
                foreach (ChurchLib.Question q in ChurchLib.Questions.LoadByFormId(question.FormId, au.ChurchId).GetByParentId(question.Id))
                {
                    q.IsParentIdNull = true;
                    q.Save();
                }
                question.Removed = true;
                question.Save();
            }
        }

        private ChurchLib.Question ConvertToDb(Models.Question q, Helpers.AuthenticatedUser au)
        {
            ChurchLib.Question db = new ChurchLib.Question() { ChurchId = au.ChurchId, Id = q.Id, FieldType=q.FieldType, FormId=q.FormId, Sort=q.Sort, Title=q.Title };

            if (q.Id == 0) db.Sort = 999;
            if (q.ParentId!=null && q.ParentId > 0) db.ParentId = q.ParentId.Value;
            if (q.Placeholder != null && q.Placeholder != "") db.Placeholder = q.Placeholder;
            if (q.Description != null && q.Description != "") db.Description = q.Description;
            if (q.Choices!=null && q.Choices.Count>0)
            {
                List<string> choices = new List<string>();
                foreach (Models.Choice c in q.Choices) choices.Add(c.Value + "~" + c.Text);
                db.Choices = String.Join("`", choices.ToArray());
            }
            return db;
        }

        private void VerifyChurchIds(ChurchLib.Questions questions, int churchId)
        {
            List<int> ids = new List<int>(questions.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.Question q in ChurchLib.Questions.Load(ids.ToArray(), churchId)) if (q.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }


    }
}
