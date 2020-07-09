 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class Donations : List<Donation>
	{

		#region Constructors
		public Donations() { }
		
		public Donations(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Donation(row));
		}
		#endregion

		#region Methods
		public static Donations Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Donations(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Donations Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new Donations();
			else return Load("SELECT * FROM Donations WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static Donations LoadAll()
		{
			return Load("SELECT * FROM Donations", CommandType.Text, null);
		}

		public static Donations LoadByBatchId(System.Int32 batchId, int churchId)
		{
			string sql="SELECT * FROM Donations WHERE ChurchId=@ChurchId AND BatchId=@BatchId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@BatchId", batchId), new MySqlParameter("@ChurchId", churchId) });
		}

		public static Donations LoadByPersonId(System.Int32 personId, int churchId)
		{
			string sql="SELECT * FROM Donations WHERE ChurchId=@ChurchId AND PersonId=@PersonId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@PersonId", personId), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Donation donation in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { donation.Save(); }
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
				foreach (Donation donation in this)
				{
					MySqlCommand cmd = donation.GetSaveCommand(conn);
					donation.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Donations WHERE ID=0");
            foreach (Donation donation in this)
            {
                DataRow row = dt.NewRow();
				if (!donation.IsChurchIdNull) row["ChurchId"] = donation.ChurchId;
				if (!donation.IsBatchIdNull) row["BatchId"] = donation.BatchId;
				if (!donation.IsPersonIdNull) row["PersonId"] = donation.PersonId;
				if (!donation.IsDonationDateNull) row["DonationDate"] = donation.DonationDate;
				if (!donation.IsAmountNull) row["Amount"] = donation.Amount;
				if (!donation.IsMethodNull) row["Method"] = donation.Method;
				if (!donation.IsMethodDetailsNull) row["MethodDetails"] = donation.MethodDetails;
				if (!donation.IsNotesNull) row["Notes"] = donation.Notes;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Donation donation in this) result.Add(donation.Id);
			return result.ToArray();
		}

		public Donation GetById(int id)
		{
			foreach (Donation donation in this) if (donation.Id == id) return donation;
			return null;
		}

		public Donations GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Donations result = new Donations();
			foreach (Donation donation in this) if (idList.Contains(donation.Id)) result.Add(donation);
			return result;
		}

		public Donations GetAllByBatchId(System.Int32 batchId)
		{
			Donations result = new Donations();
			foreach (Donation donation in this) if (donation.BatchId == batchId) result.Add(donation);
			return result;
		}

		public Donations GetAllByPersonId(System.Int32 personId)
		{
			Donations result = new Donations();
			foreach (Donation donation in this) if (donation.PersonId == personId) result.Add(donation);
			return result;
		}

		public Donations Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Donations result = new Donations();
			foreach (var i in sortedList) { result.Add((Donation)i); }
			return result;
		}

		#endregion
	}
}
