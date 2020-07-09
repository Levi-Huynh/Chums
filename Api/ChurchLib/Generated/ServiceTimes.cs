 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class ServiceTimes : List<ServiceTime>
	{

		#region Constructors
		public ServiceTimes() { }
		
		public ServiceTimes(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new ServiceTime(row));
		}
		#endregion

		#region Methods
		public static ServiceTimes Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new ServiceTimes(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static ServiceTimes Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new ServiceTimes();
			else return Load("SELECT * FROM ServiceTimes WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static ServiceTimes LoadAll()
		{
			return Load("SELECT * FROM ServiceTimes", CommandType.Text, null);
		}

		public static ServiceTimes LoadByServiceId(System.Int32 serviceId, int churchId)
		{
			string sql="SELECT * FROM ServiceTimes WHERE ChurchId=@ChurchId AND ServiceId=@ServiceId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ServiceId", serviceId), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (ServiceTime serviceTime in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { serviceTime.Save(); }
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
				foreach (ServiceTime serviceTime in this)
				{
					MySqlCommand cmd = serviceTime.GetSaveCommand(conn);
					serviceTime.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM ServiceTimes WHERE ID=0");
            foreach (ServiceTime serviceTime in this)
            {
                DataRow row = dt.NewRow();
				if (!serviceTime.IsChurchIdNull) row["ChurchId"] = serviceTime.ChurchId;
				if (!serviceTime.IsServiceIdNull) row["ServiceId"] = serviceTime.ServiceId;
				if (!serviceTime.IsNameNull) row["Name"] = serviceTime.Name;
				if (!serviceTime.IsRemovedNull) row["Removed"] = serviceTime.Removed;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (ServiceTime serviceTime in this) result.Add(serviceTime.Id);
			return result.ToArray();
		}

		public ServiceTime GetById(int id)
		{
			foreach (ServiceTime serviceTime in this) if (serviceTime.Id == id) return serviceTime;
			return null;
		}

		public ServiceTimes GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			ServiceTimes result = new ServiceTimes();
			foreach (ServiceTime serviceTime in this) if (idList.Contains(serviceTime.Id)) result.Add(serviceTime);
			return result;
		}

		public ServiceTimes GetAllByServiceId(System.Int32 serviceId)
		{
			ServiceTimes result = new ServiceTimes();
			foreach (ServiceTime serviceTime in this) if (serviceTime.ServiceId == serviceId) result.Add(serviceTime);
			return result;
		}

		public ServiceTimes Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			ServiceTimes result = new ServiceTimes();
			foreach (var i in sortedList) { result.Add((ServiceTime)i); }
			return result;
		}

		#endregion
	}
}
