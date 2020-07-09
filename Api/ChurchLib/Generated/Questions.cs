 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class Questions : List<Question>
	{

		#region Constructors
		public Questions() { }
		
		public Questions(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Question(row));
		}
		#endregion

		#region Methods
		public static Questions Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Questions(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Questions Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new Questions();
			else return Load("SELECT * FROM Questions WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static Questions LoadAll()
		{
			return Load("SELECT * FROM Questions", CommandType.Text, null);
		}

		public static Questions LoadByFormId(System.Int32 formId, int churchId)
		{
			string sql="SELECT * FROM Questions WHERE ChurchId=@ChurchId AND FormId=@FormId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@FormId", formId), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Question question in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { question.Save(); }
					finally { sem.Release(); }
				});
				tasks.Add(t);
			}
			await System.Threading.Tasks.Task.WhenAll(tasks.ToArray());
		}

		public void SaveAll(bool waitForId = true)
		{
			MySqlConnection conn = DbHelper.Connection;
			try
			{
				conn.Open();
				DbHelper.SetContextInfo(conn);
				foreach (Question question in this)
				{
					MySqlCommand cmd = question.GetSaveCommand(conn);
					question.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Questions WHERE ID=0");
            foreach (Question question in this)
            {
                DataRow row = dt.NewRow();
				if (!question.IsChurchIdNull) row["ChurchId"] = question.ChurchId;
				if (!question.IsFormIdNull) row["FormId"] = question.FormId;
				if (!question.IsParentIdNull) row["ParentId"] = question.ParentId;
				if (!question.IsTitleNull) row["Title"] = question.Title;
				if (!question.IsDescriptionNull) row["Description"] = question.Description;
				if (!question.IsFieldTypeNull) row["FieldType"] = question.FieldType;
				if (!question.IsPlaceholderNull) row["Placeholder"] = question.Placeholder;
				if (!question.IsSortNull) row["Sort"] = question.Sort;
				if (!question.IsChoicesNull) row["Choices"] = question.Choices;
				if (!question.IsRemovedNull) row["Removed"] = question.Removed;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Question question in this) result.Add(question.Id);
			return result.ToArray();
		}

		public Question GetById(int id)
		{
			foreach (Question question in this) if (question.Id == id) return question;
			return null;
		}

		public Questions GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Questions result = new Questions();
			foreach (Question question in this) if (idList.Contains(question.Id)) result.Add(question);
			return result;
		}

		public Questions GetAllByFormId(System.Int32 formId)
		{
			Questions result = new Questions();
			foreach (Question question in this) if (question.FormId == formId) result.Add(question);
			return result;
		}

		public Questions Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Questions result = new Questions();
			foreach (var i in sortedList) { result.Add((Question)i); }
			return result;
		}

		#endregion
	}
}
