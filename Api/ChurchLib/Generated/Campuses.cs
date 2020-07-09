 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class Campuses : List<Campus>
	{

		#region Constructors
		public Campuses() { }
		
		public Campuses(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Campus(row));
		}
		#endregion

		#region Methods
		public static Campuses Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Campuses(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Campuses Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new Campuses();
			else return Load("SELECT * FROM Campuses WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static Campuses LoadAll()
		{
			return Load("SELECT * FROM Campuses", CommandType.Text, null);
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Campus campus in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { campus.Save(); }
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
				foreach (Campus campus in this)
				{
					MySqlCommand cmd = campus.GetSaveCommand(conn);
					campus.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Campuses WHERE ID=0");
            foreach (Campus campus in this)
            {
                DataRow row = dt.NewRow();
				if (!campus.IsChurchIdNull) row["ChurchId"] = campus.ChurchId;
				if (!campus.IsNameNull) row["Name"] = campus.Name;
				if (!campus.IsAddress1Null) row["Address1"] = campus.Address1;
				if (!campus.IsAddress2Null) row["Address2"] = campus.Address2;
				if (!campus.IsCityNull) row["City"] = campus.City;
				if (!campus.IsStateNull) row["State"] = campus.State;
				if (!campus.IsZipNull) row["Zip"] = campus.Zip;
				if (!campus.IsRemovedNull) row["Removed"] = campus.Removed;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Campus campus in this) result.Add(campus.Id);
			return result.ToArray();
		}

		public Campus GetById(int id)
		{
			foreach (Campus campus in this) if (campus.Id == id) return campus;
			return null;
		}

		public Campuses GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Campuses result = new Campuses();
			foreach (Campus campus in this) if (idList.Contains(campus.Id)) result.Add(campus);
			return result;
		}

		public Campuses Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Campuses result = new Campuses();
			foreach (var i in sortedList) { result.Add((Campus)i); }
			return result;
		}

		#endregion
	}
}
