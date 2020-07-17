using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ChumsApiCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FormSubmissionsController : ControllerBase
    {
        // GET: api/FormSubmissions
        [HttpGet]
        public List<Models.FormSubmission> Get()
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);

            ChurchLib.FormSubmissions formSubmissions = null;
            if (HttpContext.Request.Query["contentId"].ToString() != "")
            {
                string contentType = Convert.ToString(HttpContext.Request.Query["contentType"].ToString());
                int contentId = Convert.ToInt32(HttpContext.Request.Query["contentId"].ToString());

                if (HttpContext.Request.Query["formId"]!= "")
                {
                    int formId = Convert.ToInt32(HttpContext.Request.Query["formId"].ToString());
                    formSubmissions = ChurchLib.FormSubmissions.Load(au.ChurchId, formId, contentType, contentId);
                } else formSubmissions = ChurchLib.FormSubmissions.Load(au.ChurchId, contentType, contentId);
            }

            List<string> include = Utils.GetInclude(HttpContext);
            ChurchLib.Answers answers = (include.Contains("answer")) ? ChurchLib.Answers.LoadByFormSubmissionIds(au.ChurchId, formSubmissions.GetIds()) : new ChurchLib.Answers();
            ChurchLib.Forms forms = (include.Contains("form")) ? ChurchLib.Forms.Load(formSubmissions.GetFormIds(), au.ChurchId) : new ChurchLib.Forms();

            
            
            List<Models.FormSubmission> result = new List<Models.FormSubmission>();
            foreach (ChurchLib.FormSubmission formSubmission in formSubmissions) result.Add(new Models.FormSubmission(formSubmission, forms.GetById(formSubmission.FormId), null, answers.GetAllByFormSubmissionId(formSubmission.Id)));
            return result;
        }

        // GET: api/FormSubmissions/5
        [HttpGet("{id}")]
        public Models.FormSubmission Get(int id)
        {
            
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext);
            ChurchLib.FormSubmission fs = ChurchLib.FormSubmission.Load(id, au.ChurchId);
            Models.FormSubmission result = null;
            if (fs.ChurchId == au.ChurchId) {
                List<string> include = Utils.GetInclude(HttpContext);
                ChurchLib.Questions questions = (include.Contains("questions")) ? ChurchLib.Questions.LoadByFormId(fs.FormId, au.ChurchId).GetActive() : null;
                ChurchLib.Answers answers = (include.Contains("answers")) ? ChurchLib.Answers.LoadByFormSubmissionId(fs.Id, au.ChurchId) : null;
                ChurchLib.Form form = (include.Contains("form")) ? ChurchLib.Form.Load(fs.FormId, au.ChurchId) : null;

                result = new Models.FormSubmission(fs, form, questions, answers);
            }
            return result;
        }


        // POST: api/FormSubmissions
        public int[] Post([FromBody]List<Models.FormSubmission> formSubmissions)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "People", "Edit");
            List<int> result = new List<int>();
            foreach (Models.FormSubmission fs in formSubmissions)
            {
                ChurchLib.FormSubmission dbSubmission = ConvertToDb(fs, au);
                
                //This array is just for the verify call
                ChurchLib.FormSubmissions dbSubmissions = new ChurchLib.FormSubmissions();
                dbSubmissions.Add(dbSubmission);
                VerifyChurchIds(dbSubmissions, au.ChurchId);

                dbSubmission.Save();
                result.Add(dbSubmission.Id);
                if (fs.Answers != null && fs.Answers.Count > 0) SaveAnswers(fs.Answers, dbSubmission.Id, au);
            }

            return result.ToArray();
        }


        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Helpers.AuthenticatedUser au = Helpers.AuthenticatedUsers.RequireAccess(HttpContext, "Forms", "Edit");
            foreach (ChurchLib.Answer answer in ChurchLib.Answers.LoadByFormSubmissionId(id, au.ChurchId)) ChurchLib.Answer.Delete(answer.Id, au.ChurchId);
            ChurchLib.FormSubmission.Delete(id, au.ChurchId);
        }

        private ChurchLib.FormSubmission ConvertToDb(Models.FormSubmission fs, Helpers.AuthenticatedUser au)
        {
            ChurchLib.FormSubmission db = new ChurchLib.FormSubmission() { ChurchId = au.ChurchId, ContentId=fs.ContentId, ContentType=fs.ContentType, FormId=fs.FormId, RevisedBy=au.PersonId, RevisionDate=DateTime.UtcNow, Id=fs.Id };
            
            if (fs.SubmittedBy==null || fs.SubmittedBy==0)
            {
                db.SubmittedBy = au.PersonId;
                db.SubmissionDate = db.RevisionDate;
            } else
            {
                db.SubmittedBy = fs.SubmittedBy.Value;
                db.SubmissionDate = fs.SubmissionDate.Value;
            }

            return db;
        }

        private void SaveAnswers(List<Models.Answer> answers, int formSubmissionId, Helpers.AuthenticatedUser au)
        {
            ChurchLib.Answers dbAnswers = new ChurchLib.Answers();
            foreach (Models.Answer answer in answers)
            {
                if (answer.Value!=null) dbAnswers.Add(new ChurchLib.Answer() { ChurchId = au.ChurchId, FormSubmissionId = formSubmissionId,  QuestionId = answer.QuestionId, Value = answer.Value });
            }

            ChurchLib.Answers existing = ChurchLib.Answers.LoadByFormSubmissionId(formSubmissionId, au.ChurchId);
            foreach (ChurchLib.Answer dbAnswer in dbAnswers)
            {
                ChurchLib.Answers e = existing.GetAllByQuestionId(dbAnswer.QuestionId);
                if (e.Count > 0) dbAnswer.Id = e[0].Id;
            }
            VerifyAnswersChurchIds(dbAnswers, au.ChurchId);
            dbAnswers.SaveAll();
        }

        private void VerifyChurchIds(ChurchLib.FormSubmissions submissions, int churchId)
        {
            List<int> ids = new List<int>(submissions.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.FormSubmission f in ChurchLib.FormSubmissions.Load(ids.ToArray(), churchId)) if (f.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }

        private void VerifyAnswersChurchIds(ChurchLib.Answers answers, int churchId)
        {
            List<int> ids = new List<int>(answers.GetIds());
            ids.Remove(0);
            if (ids.Count > 0)
            {
                foreach (ChurchLib.Answer a in ChurchLib.Answers.Load(ids.ToArray(), churchId)) if (a.ChurchId != churchId) Helpers.AuthenticatedUser.DenyAccess(HttpContext);
            }
        }


    }
}
