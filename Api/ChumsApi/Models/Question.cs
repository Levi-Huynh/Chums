using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChumsApiCore.Models
{
    public class Question
    {
        public int Id { get; set; }
        public int FormId { get; set; }
        public int? ParentId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string FieldType { get; set; }
        public string Placeholder { get; set; }
        public int Sort { get; set; }
        public List<Choice> Choices { get; set; }

        public Question()
        {
        }

        public Question(ChurchLib.Question q)
        {
            this.Id = q.Id;
            this.FormId = q.FormId;
            this.ParentId = q.ParentId;
            this.Title = q.Title;
            this.Description = q.Description;
            this.FieldType = q.FieldType;
            if (!q.IsPlaceholderNull && q.Placeholder!="") this.Placeholder = q.Placeholder;
            this.Sort = q.Sort;
            if (!q.IsChoicesNull && q.Choices!="")
            {
                Choices = new List<Choice>();
                string[] items = q.Choices.Split('`');
                foreach (string item in items)
                {
                    string[] pairs = item.Split('~');
                    this.Choices.Add(new Choice() { Value = pairs[0], Text=pairs[1] });
                }
            }



        }

    }

    public class Choice
    {
        public string Value { get; set; }
        public string Text { get; set; }
    }

}