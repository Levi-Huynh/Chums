 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class Sessions : List<Session>
	{

		#region Constructors
		public Sessions() { }
		
		public Sessions(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Session(row));
		}
		#endregion

		#region Methods
		public static Sessions Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Sessions(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Sessions Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new Sessions();
			else return Load("SELECT * FROM Sessions WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static Sessions LoadAll()
		{
			return Load("SELECT * FROM Sessions", CommandType.Text, null);
		}

		public static Sessions LoadByGroupId(System.Int32 groupId, int churchId)
		{
			string sql="SELECT * FROM Sessions WHERE ChurchId=@ChurchId AND GroupId=@GroupId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@GroupId", groupId), new MySqlParameter("@ChurchId", churchId) });
		}

		public static Sessions LoadByServiceTimeId(System.Int32 serviceTimeId, int churchId)
		{
			string sql="SELECT * FROM Sessions WHERE ChurchId=@ChurchId AND ServiceTimeId=@ServiceTimeId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ServiceTimeId", serviceTimeId), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Session session in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { session.Save(); }
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
				foreach (Session session in this)
				{
					MySqlCommand cmd = session.GetSaveCommand(conn);
					session.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Sessions WHERE ID=0");
            foreach (Session session in this)
            {
                DataRow row = dt.NewRow();
				if (!session.IsChurchIdNull) row["ChurchId"] = session.ChurchId;
				if (!session.IsGroupIdNull) row["GroupId"] = session.GroupId;
				if (!session.IsServiceTimeIdNull) row["ServiceTimeId"] = session.ServiceTimeId;
				if (!session.IsSessionDateNull) row["SessionDate"] = session.SessionDate;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Session session in this) result.Add(session.Id);
			return result.ToArray();
		}

		public Session GetById(int id)
		{
			foreach (Session session in this) if (session.Id == id) return session;
			return null;
		}

		public Sessions GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Sessions result = new Sessions();
			foreach (Session session in this) if (idList.Contains(session.Id)) result.Add(session);
			return result;
		}

		public Sessions GetAllByGroupId(System.Int32 groupId)
		{
			Sessions result = new Sessions();
			foreach (Session session in this) if (session.GroupId == groupId) result.Add(session);
			return result;
		}

		public Sessions GetAllByServiceTimeId(System.Int32 serviceTimeId)
		{
			Sessions result = new Sessions();
			foreach (Session session in this) if (session.ServiceTimeId == serviceTimeId) result.Add(session);
			return result;
		}

		public Sessions Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Sessions result = new Sessions();
			foreach (var i in sortedList) { result.Add((Session)i); }
			return result;
		}

		#endregion
	}
}
