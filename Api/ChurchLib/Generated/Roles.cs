 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class Roles : List<Role>
	{

		#region Constructors
		public Roles() { }
		
		public Roles(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Role(row));
		}
		#endregion

		#region Methods
		public static Roles Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Roles(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Roles Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new Roles();
			else return Load("SELECT * FROM Roles WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static Roles LoadAll()
		{
			return Load("SELECT * FROM Roles", CommandType.Text, null);
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Role role in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { role.Save(); }
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
				foreach (Role role in this)
				{
					MySqlCommand cmd = role.GetSaveCommand(conn);
					role.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Roles WHERE ID=0");
            foreach (Role role in this)
            {
                DataRow row = dt.NewRow();
				if (!role.IsChurchIdNull) row["ChurchId"] = role.ChurchId;
				if (!role.IsNameNull) row["Name"] = role.Name;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Role role in this) result.Add(role.Id);
			return result.ToArray();
		}

		public Role GetById(int id)
		{
			foreach (Role role in this) if (role.Id == id) return role;
			return null;
		}

		public Roles GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Roles result = new Roles();
			foreach (Role role in this) if (idList.Contains(role.Id)) result.Add(role);
			return result;
		}

		public Roles Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Roles result = new Roles();
			foreach (var i in sortedList) { result.Add((Role)i); }
			return result;
		}

		#endregion
	}
}
