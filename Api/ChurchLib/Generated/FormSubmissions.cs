 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class FormSubmissions : List<FormSubmission>
	{

		#region Constructors
		public FormSubmissions() { }
		
		public FormSubmissions(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new FormSubmission(row));
		}
		#endregion

		#region Methods
		public static FormSubmissions Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new FormSubmissions(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static FormSubmissions Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new FormSubmissions();
			else return Load("SELECT * FROM FormSubmissions WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static FormSubmissions LoadAll()
		{
			return Load("SELECT * FROM FormSubmissions", CommandType.Text, null);
		}

		public static FormSubmissions LoadByFormId(System.Int32 formId, int churchId)
		{
			string sql="SELECT * FROM FormSubmissions WHERE ChurchId=@ChurchId AND FormId=@FormId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@FormId", formId), new MySqlParameter("@ChurchId", churchId) });
		}

		public static FormSubmissions LoadBySubmittedBy(System.Int32 submittedBy, int churchId)
		{
			string sql="SELECT * FROM FormSubmissions WHERE ChurchId=@ChurchId AND SubmittedBy=@SubmittedBy;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@SubmittedBy", submittedBy), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (FormSubmission formSubmission in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { formSubmission.Save(); }
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
				foreach (FormSubmission formSubmission in this)
				{
					MySqlCommand cmd = formSubmission.GetSaveCommand(conn);
					formSubmission.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM FormSubmissions WHERE ID=0");
            foreach (FormSubmission formSubmission in this)
            {
                DataRow row = dt.NewRow();
				if (!formSubmission.IsChurchIdNull) row["ChurchId"] = formSubmission.ChurchId;
				if (!formSubmission.IsFormIdNull) row["FormId"] = formSubmission.FormId;
				if (!formSubmission.IsContentTypeNull) row["ContentType"] = formSubmission.ContentType;
				if (!formSubmission.IsContentIdNull) row["ContentId"] = formSubmission.ContentId;
				if (!formSubmission.IsSubmissionDateNull) row["SubmissionDate"] = formSubmission.SubmissionDate;
				if (!formSubmission.IsSubmittedByNull) row["SubmittedBy"] = formSubmission.SubmittedBy;
				if (!formSubmission.IsRevisionDateNull) row["RevisionDate"] = formSubmission.RevisionDate;
				if (!formSubmission.IsRevisedByNull) row["RevisedBy"] = formSubmission.RevisedBy;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (FormSubmission formSubmission in this) result.Add(formSubmission.Id);
			return result.ToArray();
		}

		public FormSubmission GetById(int id)
		{
			foreach (FormSubmission formSubmission in this) if (formSubmission.Id == id) return formSubmission;
			return null;
		}

		public FormSubmissions GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			FormSubmissions result = new FormSubmissions();
			foreach (FormSubmission formSubmission in this) if (idList.Contains(formSubmission.Id)) result.Add(formSubmission);
			return result;
		}

		public FormSubmissions GetAllByFormId(System.Int32 formId)
		{
			FormSubmissions result = new FormSubmissions();
			foreach (FormSubmission formSubmission in this) if (formSubmission.FormId == formId) result.Add(formSubmission);
			return result;
		}

		public FormSubmissions GetAllBySubmittedBy(System.Int32 submittedBy)
		{
			FormSubmissions result = new FormSubmissions();
			foreach (FormSubmission formSubmission in this) if (formSubmission.SubmittedBy == submittedBy) result.Add(formSubmission);
			return result;
		}

		public FormSubmissions Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			FormSubmissions result = new FormSubmissions();
			foreach (var i in sortedList) { result.Add((FormSubmission)i); }
			return result;
		}

		#endregion
	}
}
