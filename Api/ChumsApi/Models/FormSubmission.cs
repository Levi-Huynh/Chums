using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class FormSubmission
    {
        public int Id { get; set; }
        public int FormId { get; set; }
        public string ContentType { get; set; }
        public int ContentId { get; set; }
        public DateTime? SubmissionDate { get; set; }
        public int? SubmittedBy { get; set; }
        public DateTime? RevisionDate { get; set; }
        public int? RevisedBy { get; set; }
        public List<Question> Questions { get; set; }
        public List<Answer> Answers { get; set; }
        public Form Form { get; set; }

        public FormSubmission()
        {
        }

        public FormSubmission(ChurchLib.FormSubmission fs, ChurchLib.Form form=null, ChurchLib.Questions questions=null, ChurchLib.Answers answers=null)
        {
            this.Id = fs.Id;
            this.FormId = fs.FormId;
            this.ContentType = fs.ContentType;
            this.ContentId = fs.ContentId;
            this.SubmissionDate = fs.SubmissionDate;
            this.SubmittedBy = fs.SubmittedBy;
            this.RevisionDate = fs.RevisionDate;
            this.RevisedBy = fs.RevisedBy;

            if (form!=null)
            {
                this.Form = new Models.Form(form);
            }

            if (questions!=null)
            {
                this.Questions = new List<Question>();
                foreach (ChurchLib.Question question in questions) this.Questions.Add(new Models.Question(question));
            }

            if (answers != null)
            {
                this.Answers = new List<Answer>();
                foreach (ChurchLib.Answer answer in answers) this.Answers.Add(new Models.Answer(answer));
            }

        }

    }
}