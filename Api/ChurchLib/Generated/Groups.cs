 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class Groups : List<Group>
	{

		#region Constructors
		public Groups() { }
		
		public Groups(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Group(row));
		}
		#endregion

		#region Methods
		public static Groups Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Groups(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Groups Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new Groups();
			else return Load("SELECT * FROM Groups WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static Groups LoadAll()
		{
			return Load("SELECT * FROM Groups", CommandType.Text, null);
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Group group in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { group.Save(); }
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
				foreach (Group group in this)
				{
					MySqlCommand cmd = group.GetSaveCommand(conn);
					group.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Groups WHERE ID=0");
            foreach (Group group in this)
            {
                DataRow row = dt.NewRow();
				if (!group.IsChurchIdNull) row["ChurchId"] = group.ChurchId;
				if (!group.IsCategoryNameNull) row["CategoryName"] = group.CategoryName;
				if (!group.IsNameNull) row["Name"] = group.Name;
				if (!group.IsTrackAttendanceNull) row["TrackAttendance"] = group.TrackAttendance;
				if (!group.IsRemovedNull) row["Removed"] = group.Removed;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Group group in this) result.Add(group.Id);
			return result.ToArray();
		}

		public Group GetById(int id)
		{
			foreach (Group group in this) if (group.Id == id) return group;
			return null;
		}

		public Groups GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Groups result = new Groups();
			foreach (Group group in this) if (idList.Contains(group.Id)) result.Add(group);
			return result;
		}

		public Groups Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Groups result = new Groups();
			foreach (var i in sortedList) { result.Add((Group)i); }
			return result;
		}

		#endregion
	}
}
