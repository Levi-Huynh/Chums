
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib
{
	[Serializable]
	public partial class Jobs : List<Job>
	{

		#region Constructors
		public Jobs() { }

		public Jobs(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Job(row));
		}
		#endregion

		#region Methods
		public static Jobs Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Jobs(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Jobs Load(int[] ids, int churchId)
		{
			if (ids.Length == 0) return new Jobs();
			else return Load("SELECT * FROM Jobs WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static Jobs LoadAll()
		{
			return Load("SELECT * FROM Jobs", CommandType.Text, null);
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Job job in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { job.Save(); }
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
				foreach (Job job in this)
				{
					MySqlCommand cmd = job.GetSaveCommand(conn);
					job.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Jobs WHERE ID=0");
			foreach (Job job in this)
			{
				DataRow row = dt.NewRow();
				if (!job.IsChurchIdNull) row["ChurchId"] = job.ChurchId;
				if (!job.IsJobTypeNull) row["JobType"] = job.JobType;
				if (!job.IsStartTimeNull) row["StartTime"] = job.StartTime;
				if (!job.IsEndTimeNull) row["EndTime"] = job.EndTime;
				if (!job.IsAssociatedFileNull) row["AssociatedFile"] = job.AssociatedFile;
				dt.Rows.Add(row);
			}
			return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Job job in this) result.Add(job.Id);
			return result.ToArray();
		}

		public Job GetById(int id)
		{
			foreach (Job job in this) if (job.Id == id) return job;
			return null;
		}

		public Jobs GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Jobs result = new Jobs();
			foreach (Job job in this) if (idList.Contains(job.Id)) result.Add(job);
			return result;
		}

		public Jobs Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Jobs result = new Jobs();
			foreach (var i in sortedList) { result.Add((Job)i); }
			return result;
		}

		#endregion
	}
}
