 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace MasterLib{
	[Serializable]
	public partial class Churches : List<Church>
	{

		#region Constructors
		public Churches() { }
		
		public Churches(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Church(row));
		}
		#endregion

		#region Methods
		public static Churches Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Churches(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Churches Load(int[] ids)
		{
			if (ids.Length==0) return new Churches();
			else return Load("SELECT * FROM Churches WHERE ID IN (" + String.Join(",", ids) + ")");
		}

		public static Churches LoadAll()
		{
			return Load("SELECT * FROM Churches", CommandType.Text, null);
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Church church in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { church.Save(); }
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
				foreach (Church church in this)
				{
					MySqlCommand cmd = church.GetSaveCommand(conn);
					church.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Churches WHERE ID=0");
            foreach (Church church in this)
            {
                DataRow row = dt.NewRow();
				if (!church.IsNameNull) row["Name"] = church.Name;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Church church in this) result.Add(church.Id);
			return result.ToArray();
		}

		public Church GetById(int id)
		{
			foreach (Church church in this) if (church.Id == id) return church;
			return null;
		}

		public Churches GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Churches result = new Churches();
			foreach (Church church in this) if (idList.Contains(church.Id)) result.Add(church);
			return result;
		}

		public Churches Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Churches result = new Churches();
			foreach (var i in sortedList) { result.Add((Church)i); }
			return result;
		}

		#endregion
	}
}
