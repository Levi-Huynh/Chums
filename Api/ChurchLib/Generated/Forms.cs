 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class Forms : List<Form>
	{

		#region Constructors
		public Forms() { }
		
		public Forms(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Form(row));
		}
		#endregion

		#region Methods
		public static Forms Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Forms(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Forms Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new Forms();
			else return Load("SELECT * FROM Forms WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static Forms LoadAll()
		{
			return Load("SELECT * FROM Forms", CommandType.Text, null);
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Form form in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { form.Save(); }
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
				foreach (Form form in this)
				{
					MySqlCommand cmd = form.GetSaveCommand(conn);
					form.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Forms WHERE ID=0");
            foreach (Form form in this)
            {
                DataRow row = dt.NewRow();
				if (!form.IsChurchIdNull) row["ChurchId"] = form.ChurchId;
				if (!form.IsNameNull) row["Name"] = form.Name;
				if (!form.IsContentTypeNull) row["ContentType"] = form.ContentType;
				if (!form.IsCreatedTimeNull) row["CreatedTime"] = form.CreatedTime;
				if (!form.IsModifiedTimeNull) row["ModifiedTime"] = form.ModifiedTime;
				if (!form.IsRemovedNull) row["Removed"] = form.Removed;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Form form in this) result.Add(form.Id);
			return result.ToArray();
		}

		public Form GetById(int id)
		{
			foreach (Form form in this) if (form.Id == id) return form;
			return null;
		}

		public Forms GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Forms result = new Forms();
			foreach (Form form in this) if (idList.Contains(form.Id)) result.Add(form);
			return result;
		}

		public Forms Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Forms result = new Forms();
			foreach (var i in sortedList) { result.Add((Form)i); }
			return result;
		}

		#endregion
	}
}
