 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class FundDonations : List<FundDonation>
	{

		#region Constructors
		public FundDonations() { }
		
		public FundDonations(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new FundDonation(row));
		}
		#endregion

		#region Methods
		public static FundDonations Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new FundDonations(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static FundDonations Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new FundDonations();
			else return Load("SELECT * FROM FundDonations WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static FundDonations LoadAll()
		{
			return Load("SELECT * FROM FundDonations", CommandType.Text, null);
		}

		public static FundDonations LoadByDonationId(System.Int32 donationId, int churchId)
		{
			string sql="SELECT * FROM FundDonations WHERE ChurchId=@ChurchId AND DonationId=@DonationId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@DonationId", donationId), new MySqlParameter("@ChurchId", churchId) });
		}

		public static FundDonations LoadByFundId(System.Int32 fundId, int churchId)
		{
			string sql="SELECT * FROM FundDonations WHERE ChurchId=@ChurchId AND FundId=@FundId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@FundId", fundId), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (FundDonation fundDonation in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { fundDonation.Save(); }
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
				foreach (FundDonation fundDonation in this)
				{
					MySqlCommand cmd = fundDonation.GetSaveCommand(conn);
					fundDonation.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM FundDonations WHERE ID=0");
            foreach (FundDonation fundDonation in this)
            {
                DataRow row = dt.NewRow();
				if (!fundDonation.IsChurchIdNull) row["ChurchId"] = fundDonation.ChurchId;
				if (!fundDonation.IsDonationIdNull) row["DonationId"] = fundDonation.DonationId;
				if (!fundDonation.IsFundIdNull) row["FundId"] = fundDonation.FundId;
				if (!fundDonation.IsAmountNull) row["Amount"] = fundDonation.Amount;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (FundDonation fundDonation in this) result.Add(fundDonation.Id);
			return result.ToArray();
		}

		public FundDonation GetById(int id)
		{
			foreach (FundDonation fundDonation in this) if (fundDonation.Id == id) return fundDonation;
			return null;
		}

		public FundDonations GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			FundDonations result = new FundDonations();
			foreach (FundDonation fundDonation in this) if (idList.Contains(fundDonation.Id)) result.Add(fundDonation);
			return result;
		}

		public FundDonations GetAllByDonationId(System.Int32 donationId)
		{
			FundDonations result = new FundDonations();
			foreach (FundDonation fundDonation in this) if (fundDonation.DonationId == donationId) result.Add(fundDonation);
			return result;
		}

		public FundDonations GetAllByFundId(System.Int32 fundId)
		{
			FundDonations result = new FundDonations();
			foreach (FundDonation fundDonation in this) if (fundDonation.FundId == fundId) result.Add(fundDonation);
			return result;
		}

		public FundDonations Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			FundDonations result = new FundDonations();
			foreach (var i in sortedList) { result.Add((FundDonation)i); }
			return result;
		}

		#endregion
	}
}
