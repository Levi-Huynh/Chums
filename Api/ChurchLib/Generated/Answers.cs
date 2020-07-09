 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class Answers : List<Answer>
	{

		#region Constructors
		public Answers() { }
		
		public Answers(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Answer(row));
		}
		#endregion

		#region Methods
		public static Answers Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Answers(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Answers Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new Answers();
			else return Load("SELECT * FROM Answers WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static Answers LoadAll()
		{
			return Load("SELECT * FROM Answers", CommandType.Text, null);
		}

		public static Answers LoadByFormSubmissionId(System.Int32 formSubmissionId, int churchId)
		{
			string sql="SELECT * FROM Answers WHERE ChurchId=@ChurchId AND FormSubmissionId=@FormSubmissionId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@FormSubmissionId", formSubmissionId), new MySqlParameter("@ChurchId", churchId) });
		}

		public static Answers LoadByQuestionId(System.Int32 questionId, int churchId)
		{
			string sql="SELECT * FROM Answers WHERE ChurchId=@ChurchId AND QuestionId=@QuestionId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@QuestionId", questionId), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Answer answer in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { answer.Save(); }
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
				foreach (Answer answer in this)
				{
					MySqlCommand cmd = answer.GetSaveCommand(conn);
					answer.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Answers WHERE ID=0");
            foreach (Answer answer in this)
            {
                DataRow row = dt.NewRow();
				if (!answer.IsChurchIdNull) row["ChurchId"] = answer.ChurchId;
				if (!answer.IsFormSubmissionIdNull) row["FormSubmissionId"] = answer.FormSubmissionId;
				if (!answer.IsQuestionIdNull) row["QuestionId"] = answer.QuestionId;
				if (!answer.IsValueNull) row["Value"] = answer.Value;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Answer answer in this) result.Add(answer.Id);
			return result.ToArray();
		}

		public Answer GetById(int id)
		{
			foreach (Answer answer in this) if (answer.Id == id) return answer;
			return null;
		}

		public Answers GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Answers result = new Answers();
			foreach (Answer answer in this) if (idList.Contains(answer.Id)) result.Add(answer);
			return result;
		}

		public Answers GetAllByFormSubmissionId(System.Int32 formSubmissionId)
		{
			Answers result = new Answers();
			foreach (Answer answer in this) if (answer.FormSubmissionId == formSubmissionId) result.Add(answer);
			return result;
		}

		public Answers GetAllByQuestionId(System.Int32 questionId)
		{
			Answers result = new Answers();
			foreach (Answer answer in this) if (answer.QuestionId == questionId) result.Add(answer);
			return result;
		}

		public Answers Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Answers result = new Answers();
			foreach (var i in sortedList) { result.Add((Answer)i); }
			return result;
		}

		#endregion
	}
}
