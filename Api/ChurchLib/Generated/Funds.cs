 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class Funds : List<Fund>
	{

		#region Constructors
		public Funds() { }
		
		public Funds(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Fund(row));
		}
		#endregion

		#region Methods
		public static Funds Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Funds(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Funds Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new Funds();
			else return Load("SELECT * FROM Funds WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static Funds LoadAll()
		{
			return Load("SELECT * FROM Funds", CommandType.Text, null);
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Fund fund in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { fund.Save(); }
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
				foreach (Fund fund in this)
				{
					MySqlCommand cmd = fund.GetSaveCommand(conn);
					fund.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Funds WHERE ID=0");
            foreach (Fund fund in this)
            {
                DataRow row = dt.NewRow();
				if (!fund.IsChurchIdNull) row["ChurchId"] = fund.ChurchId;
				if (!fund.IsNameNull) row["Name"] = fund.Name;
				if (!fund.IsRemovedNull) row["Removed"] = fund.Removed;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Fund fund in this) result.Add(fund.Id);
			return result.ToArray();
		}

		public Fund GetById(int id)
		{
			foreach (Fund fund in this) if (fund.Id == id) return fund;
			return null;
		}

		public Funds GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Funds result = new Funds();
			foreach (Fund fund in this) if (idList.Contains(fund.Id)) result.Add(fund);
			return result;
		}

		public Funds Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Funds result = new Funds();
			foreach (var i in sortedList) { result.Add((Fund)i); }
			return result;
		}

		#endregion
	}
}
