 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class Households : List<Household>
	{

		#region Constructors
		public Households() { }
		
		public Households(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Household(row));
		}
		#endregion

		#region Methods
		public static Households Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Households(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Households Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new Households();
			else return Load("SELECT * FROM Households WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static Households LoadAll()
		{
			return Load("SELECT * FROM Households", CommandType.Text, null);
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Household household in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { household.Save(); }
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
				foreach (Household household in this)
				{
					MySqlCommand cmd = household.GetSaveCommand(conn);
					household.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Households WHERE ID=0");
            foreach (Household household in this)
            {
                DataRow row = dt.NewRow();
				if (!household.IsChurchIdNull) row["ChurchId"] = household.ChurchId;
				if (!household.IsNameNull) row["Name"] = household.Name;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Household household in this) result.Add(household.Id);
			return result.ToArray();
		}

		public Household GetById(int id)
		{
			foreach (Household household in this) if (household.Id == id) return household;
			return null;
		}

		public Households GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Households result = new Households();
			foreach (Household household in this) if (idList.Contains(household.Id)) result.Add(household);
			return result;
		}

		public Households Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Households result = new Households();
			foreach (var i in sortedList) { result.Add((Household)i); }
			return result;
		}

		#endregion
	}
}
