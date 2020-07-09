 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace MasterLib{
	[Serializable]
	public partial class UserMappings : List<UserMapping>
	{

		#region Constructors
		public UserMappings() { }
		
		public UserMappings(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new UserMapping(row));
		}
		#endregion

		#region Methods
		public static UserMappings Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new UserMappings(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static UserMappings Load(int[] ids)
		{
			if (ids.Length==0) return new UserMappings();
			else return Load("SELECT * FROM UserMappings WHERE ID IN (" + String.Join(",", ids) + ")");
		}

		public static UserMappings LoadAll()
		{
			return Load("SELECT * FROM UserMappings", CommandType.Text, null);
		}

		public static UserMappings LoadByChurchId(System.Int32 churchId)
		{
			string sql="SELECT * FROM UserMappings WHERE ChurchId=@ChurchId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ChurchId", churchId)});
		}

		public static UserMappings LoadByUserId(System.Int32 userId)
		{
			string sql="SELECT * FROM UserMappings WHERE UserId=@UserId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@UserId", userId)});
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (UserMapping userMapping in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { userMapping.Save(); }
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
				foreach (UserMapping userMapping in this)
				{
					MySqlCommand cmd = userMapping.GetSaveCommand(conn);
					userMapping.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM UserMappings WHERE ID=0");
            foreach (UserMapping userMapping in this)
            {
                DataRow row = dt.NewRow();
				if (!userMapping.IsUserIdNull) row["UserId"] = userMapping.UserId;
				if (!userMapping.IsChurchIdNull) row["ChurchId"] = userMapping.ChurchId;
				if (!userMapping.IsPersonIdNull) row["PersonId"] = userMapping.PersonId;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (UserMapping userMapping in this) result.Add(userMapping.Id);
			return result.ToArray();
		}

		public UserMapping GetById(int id)
		{
			foreach (UserMapping userMapping in this) if (userMapping.Id == id) return userMapping;
			return null;
		}

		public UserMappings GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			UserMappings result = new UserMappings();
			foreach (UserMapping userMapping in this) if (idList.Contains(userMapping.Id)) result.Add(userMapping);
			return result;
		}

		public UserMappings GetAllByChurchId(System.Int32 churchId)
		{
			UserMappings result = new UserMappings();
			foreach (UserMapping userMapping in this) if (userMapping.ChurchId == churchId) result.Add(userMapping);
			return result;
		}

		public UserMappings GetAllByUserId(System.Int32 userId)
		{
			UserMappings result = new UserMappings();
			foreach (UserMapping userMapping in this) if (userMapping.UserId == userId) result.Add(userMapping);
			return result;
		}

		public UserMappings Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			UserMappings result = new UserMappings();
			foreach (var i in sortedList) { result.Add((UserMapping)i); }
			return result;
		}

		#endregion
	}
}
