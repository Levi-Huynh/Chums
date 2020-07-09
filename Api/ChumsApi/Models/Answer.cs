using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class Answer
    {
        public int FormSubmissionId { get; set; }
        public int QuestionId { get; set; }
        public string Value { get; set; }

        public Answer()
        {
        }

        public Answer(ChurchLib.Answer a)
        {
            this.FormSubmissionId = a.FormSubmissionId;
            this.QuestionId = a.QuestionId;
            this.Value = a.Value;
        }

    }
}