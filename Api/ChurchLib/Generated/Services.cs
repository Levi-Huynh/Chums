 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class Services : List<Service>
	{

		#region Constructors
		public Services() { }
		
		public Services(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Service(row));
		}
		#endregion

		#region Methods
		public static Services Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Services(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Services Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new Services();
			else return Load("SELECT * FROM Services WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static Services LoadAll()
		{
			return Load("SELECT * FROM Services", CommandType.Text, null);
		}

		public static Services LoadByCampusId(System.Int32 campusId, int churchId)
		{
			string sql="SELECT * FROM Services WHERE ChurchId=@ChurchId AND CampusId=@CampusId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@CampusId", campusId), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Service service in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { service.Save(); }
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
				foreach (Service service in this)
				{
					MySqlCommand cmd = service.GetSaveCommand(conn);
					service.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Services WHERE ID=0");
            foreach (Service service in this)
            {
                DataRow row = dt.NewRow();
				if (!service.IsChurchIdNull) row["ChurchId"] = service.ChurchId;
				if (!service.IsCampusIdNull) row["CampusId"] = service.CampusId;
				if (!service.IsNameNull) row["Name"] = service.Name;
				if (!service.IsRemovedNull) row["Removed"] = service.Removed;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Service service in this) result.Add(service.Id);
			return result.ToArray();
		}

		public Service GetById(int id)
		{
			foreach (Service service in this) if (service.Id == id) return service;
			return null;
		}

		public Services GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Services result = new Services();
			foreach (Service service in this) if (idList.Contains(service.Id)) result.Add(service);
			return result;
		}

		public Services GetAllByCampusId(System.Int32 campusId)
		{
			Services result = new Services();
			foreach (Service service in this) if (service.CampusId == campusId) result.Add(service);
			return result;
		}

		public Services Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Services result = new Services();
			foreach (var i in sortedList) { result.Add((Service)i); }
			return result;
		}

		#endregion
	}
}
