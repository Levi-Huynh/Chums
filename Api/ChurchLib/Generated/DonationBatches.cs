 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class DonationBatches : List<DonationBatch>
	{

		#region Constructors
		public DonationBatches() { }
		
		public DonationBatches(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new DonationBatch(row));
		}
		#endregion

		#region Methods
		public static DonationBatches Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new DonationBatches(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static DonationBatches Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new DonationBatches();
			else return Load("SELECT * FROM DonationBatches WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static DonationBatches LoadAll()
		{
			return Load("SELECT * FROM DonationBatches", CommandType.Text, null);
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (DonationBatch donationBatch in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { donationBatch.Save(); }
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
				foreach (DonationBatch donationBatch in this)
				{
					MySqlCommand cmd = donationBatch.GetSaveCommand(conn);
					donationBatch.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM DonationBatches WHERE ID=0");
            foreach (DonationBatch donationBatch in this)
            {
                DataRow row = dt.NewRow();
				if (!donationBatch.IsChurchIdNull) row["ChurchId"] = donationBatch.ChurchId;
				if (!donationBatch.IsNameNull) row["Name"] = donationBatch.Name;
				if (!donationBatch.IsBatchDateNull) row["BatchDate"] = donationBatch.BatchDate;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (DonationBatch donationBatch in this) result.Add(donationBatch.Id);
			return result.ToArray();
		}

		public DonationBatch GetById(int id)
		{
			foreach (DonationBatch donationBatch in this) if (donationBatch.Id == id) return donationBatch;
			return null;
		}

		public DonationBatches GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			DonationBatches result = new DonationBatches();
			foreach (DonationBatch donationBatch in this) if (idList.Contains(donationBatch.Id)) result.Add(donationBatch);
			return result;
		}

		public DonationBatches Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			DonationBatches result = new DonationBatches();
			foreach (var i in sortedList) { result.Add((DonationBatch)i); }
			return result;
		}

		#endregion
	}
}
