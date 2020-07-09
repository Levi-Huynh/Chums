 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class HouseholdMembers : List<HouseholdMember>
	{

		#region Constructors
		public HouseholdMembers() { }
		
		public HouseholdMembers(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new HouseholdMember(row));
		}
		#endregion

		#region Methods
		public static HouseholdMembers Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new HouseholdMembers(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static HouseholdMembers Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new HouseholdMembers();
			else return Load("SELECT * FROM HouseholdMembers WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static HouseholdMembers LoadAll()
		{
			return Load("SELECT * FROM HouseholdMembers", CommandType.Text, null);
		}

		public static HouseholdMembers LoadByHouseholdId(System.Int32 householdId, int churchId)
		{
			string sql="SELECT * FROM HouseholdMembers WHERE ChurchId=@ChurchId AND HouseholdId=@HouseholdId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@HouseholdId", householdId), new MySqlParameter("@ChurchId", churchId) });
		}

		public static HouseholdMembers LoadByPersonId(System.Int32 personId, int churchId)
		{
			string sql="SELECT * FROM HouseholdMembers WHERE ChurchId=@ChurchId AND PersonId=@PersonId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@PersonId", personId), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (HouseholdMember householdMember in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { householdMember.Save(); }
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
				foreach (HouseholdMember householdMember in this)
				{
					MySqlCommand cmd = householdMember.GetSaveCommand(conn);
					householdMember.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM HouseholdMembers WHERE ID=0");
            foreach (HouseholdMember householdMember in this)
            {
                DataRow row = dt.NewRow();
				if (!householdMember.IsChurchIdNull) row["ChurchId"] = householdMember.ChurchId;
				if (!householdMember.IsHouseholdIdNull) row["HouseholdId"] = householdMember.HouseholdId;
				if (!householdMember.IsPersonIdNull) row["PersonId"] = householdMember.PersonId;
				if (!householdMember.IsRoleNull) row["Role"] = householdMember.Role;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (HouseholdMember householdMember in this) result.Add(householdMember.Id);
			return result.ToArray();
		}

		public HouseholdMember GetById(int id)
		{
			foreach (HouseholdMember householdMember in this) if (householdMember.Id == id) return householdMember;
			return null;
		}

		public HouseholdMembers GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			HouseholdMembers result = new HouseholdMembers();
			foreach (HouseholdMember householdMember in this) if (idList.Contains(householdMember.Id)) result.Add(householdMember);
			return result;
		}

		public HouseholdMembers GetAllByHouseholdId(System.Int32 householdId)
		{
			HouseholdMembers result = new HouseholdMembers();
			foreach (HouseholdMember householdMember in this) if (householdMember.HouseholdId == householdId) result.Add(householdMember);
			return result;
		}

		public HouseholdMembers GetAllByPersonId(System.Int32 personId)
		{
			HouseholdMembers result = new HouseholdMembers();
			foreach (HouseholdMember householdMember in this) if (householdMember.PersonId == personId) result.Add(householdMember);
			return result;
		}

		public HouseholdMembers Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			HouseholdMembers result = new HouseholdMembers();
			foreach (var i in sortedList) { result.Add((HouseholdMember)i); }
			return result;
		}

		#endregion
	}
}
