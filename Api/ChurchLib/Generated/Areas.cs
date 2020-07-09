 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class Areas : List<Area>
	{

		#region Constructors
		public Areas() { }
		
		public Areas(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Area(row));
		}
		#endregion

		#region Methods
		public static Areas Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Areas(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Areas Load(int[] ids)
		{
			if (ids.Length==0) return new Areas();
			else return Load("SELECT * FROM Areas WHERE ID IN (" + String.Join(",", ids) + ")");
		}

		public static Areas LoadAll()
		{
			return Load("LoadAreasAll", CommandType.StoredProcedure, null);
		}

		public static Areas LoadByEventId(System.Int32 eventId)
		{
			return Load("LoadAreasByEventId", CommandType.StoredProcedure, new MySqlParameter[] { new MySqlParameter("@EventId", eventId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Area area in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { area.Save(); }
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
				foreach (Area area in this)
				{
					MySqlCommand cmd = area.GetSaveCommand(conn);
					area.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		private void BulkInsert()
        {
            DbHelper.BulkInsert(ConvertToDataTable(), "Areas");
        }

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Areas WHERE ID=0");
            foreach (Area area in this)
            {
                DataRow row = dt.NewRow();
				if (!area.IsChurchIdNull) row["ChurchId"] = area.ChurchId;
				if (!area.IsEventIdNull) row["EventId"] = area.EventId;
				if (!area.IsNameNull) row["Name"] = area.Name;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Area area in this) result.Add(area.Id);
			return result.ToArray();
		}

		public Area GetById(int id)
		{
			foreach (Area area in this) if (area.Id == id) return area;
			return null;
		}

		public Areas GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Areas result = new Areas();
			foreach (Area area in this) if (idList.Contains(area.Id)) result.Add(area);
			return result;
		}

		public Areas GetAllByEventId(System.Int32 eventId)
		{
			Areas result = new Areas();
			foreach (Area area in this) if (area.EventId == eventId) result.Add(area);
			return result;
		}

		public Areas Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Areas result = new Areas();
			foreach (var i in sortedList) { result.Add((Area)i); }
			return result;
		}

		#endregion
	}
}
