 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class VisitSessions : List<VisitSession>
	{

		#region Constructors
		public VisitSessions() { }
		
		public VisitSessions(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new VisitSession(row));
		}
		#endregion

		#region Methods
		public static VisitSessions Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new VisitSessions(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static VisitSessions Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new VisitSessions();
			else return Load("SELECT * FROM VisitSessions WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static VisitSessions LoadAll()
		{
			return Load("SELECT * FROM VisitSessions", CommandType.Text, null);
		}

		public static VisitSessions LoadBySessionId(System.Int32 sessionId, int churchId)
		{
			string sql="SELECT * FROM VisitSessions WHERE ChurchId=@ChurchId AND SessionId=@SessionId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@SessionId", sessionId), new MySqlParameter("@ChurchId", churchId) });
		}

		public static VisitSessions LoadByVisitId(System.Int32 visitId, int churchId)
		{
			string sql="SELECT * FROM VisitSessions WHERE ChurchId=@ChurchId AND VisitId=@VisitId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@VisitId", visitId), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (VisitSession visitSession in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { visitSession.Save(); }
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
				foreach (VisitSession visitSession in this)
				{
					MySqlCommand cmd = visitSession.GetSaveCommand(conn);
					visitSession.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM VisitSessions WHERE ID=0");
            foreach (VisitSession visitSession in this)
            {
                DataRow row = dt.NewRow();
				if (!visitSession.IsChurchIdNull) row["ChurchId"] = visitSession.ChurchId;
				if (!visitSession.IsVisitIdNull) row["VisitId"] = visitSession.VisitId;
				if (!visitSession.IsSessionIdNull) row["SessionId"] = visitSession.SessionId;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (VisitSession visitSession in this) result.Add(visitSession.Id);
			return result.ToArray();
		}

		public VisitSession GetById(int id)
		{
			foreach (VisitSession visitSession in this) if (visitSession.Id == id) return visitSession;
			return null;
		}

		public VisitSessions GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			VisitSessions result = new VisitSessions();
			foreach (VisitSession visitSession in this) if (idList.Contains(visitSession.Id)) result.Add(visitSession);
			return result;
		}

		public VisitSessions GetAllBySessionId(System.Int32 sessionId)
		{
			VisitSessions result = new VisitSessions();
			foreach (VisitSession visitSession in this) if (visitSession.SessionId == sessionId) result.Add(visitSession);
			return result;
		}

		public VisitSessions GetAllByVisitId(System.Int32 visitId)
		{
			VisitSessions result = new VisitSessions();
			foreach (VisitSession visitSession in this) if (visitSession.VisitId == visitId) result.Add(visitSession);
			return result;
		}

		public VisitSessions Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			VisitSessions result = new VisitSessions();
			foreach (var i in sortedList) { result.Add((VisitSession)i); }
			return result;
		}

		#endregion
	}
}
