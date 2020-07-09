 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class Visits : List<Visit>
	{

		#region Constructors
		public Visits() { }
		
		public Visits(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Visit(row));
		}
		#endregion

		#region Methods
		public static Visits Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Visits(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Visits Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new Visits();
			else return Load("SELECT * FROM Visits WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static Visits LoadAll()
		{
			return Load("SELECT * FROM Visits", CommandType.Text, null);
		}

		public static Visits LoadByPersonId(System.Int32 personId, int churchId)
		{
			string sql="SELECT * FROM Visits WHERE ChurchId=@ChurchId AND PersonId=@PersonId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@PersonId", personId), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Visit visit in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { visit.Save(); }
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
				foreach (Visit visit in this)
				{
					MySqlCommand cmd = visit.GetSaveCommand(conn);
					visit.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Visits WHERE ID=0");
            foreach (Visit visit in this)
            {
                DataRow row = dt.NewRow();
				if (!visit.IsChurchIdNull) row["ChurchId"] = visit.ChurchId;
				if (!visit.IsPersonIdNull) row["PersonId"] = visit.PersonId;
				if (!visit.IsServiceIdNull) row["ServiceId"] = visit.ServiceId;
				if (!visit.IsGroupIdNull) row["GroupId"] = visit.GroupId;
				if (!visit.IsVisitDateNull) row["VisitDate"] = visit.VisitDate;
				if (!visit.IsCheckinTimeNull) row["CheckinTime"] = visit.CheckinTime;
				if (!visit.IsAddedByNull) row["AddedBy"] = visit.AddedBy;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Visit visit in this) result.Add(visit.Id);
			return result.ToArray();
		}

		public Visit GetById(int id)
		{
			foreach (Visit visit in this) if (visit.Id == id) return visit;
			return null;
		}

		public Visits GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Visits result = new Visits();
			foreach (Visit visit in this) if (idList.Contains(visit.Id)) result.Add(visit);
			return result;
		}

		public Visits GetAllByPersonId(System.Int32 personId)
		{
			Visits result = new Visits();
			foreach (Visit visit in this) if (visit.PersonId == personId) result.Add(visit);
			return result;
		}

		public Visits Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Visits result = new Visits();
			foreach (var i in sortedList) { result.Add((Visit)i); }
			return result;
		}

		#endregion
	}
}
