 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class RoleMembers : List<RoleMember>
	{

		#region Constructors
		public RoleMembers() { }
		
		public RoleMembers(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new RoleMember(row));
		}
		#endregion

		#region Methods
		public static RoleMembers Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new RoleMembers(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static RoleMembers Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new RoleMembers();
			else return Load("SELECT * FROM RoleMembers WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static RoleMembers LoadAll()
		{
			return Load("SELECT * FROM RoleMembers", CommandType.Text, null);
		}

		public static RoleMembers LoadByPersonId(System.Int32 personId, int churchId)
		{
			string sql="SELECT * FROM RoleMembers WHERE ChurchId=@ChurchId AND PersonId=@PersonId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@PersonId", personId), new MySqlParameter("@ChurchId", churchId) });
		}

		public static RoleMembers LoadByRoleId(System.Int32 roleId, int churchId)
		{
			string sql="SELECT * FROM RoleMembers WHERE ChurchId=@ChurchId AND RoleId=@RoleId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@RoleId", roleId), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (RoleMember roleMember in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { roleMember.Save(); }
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
				foreach (RoleMember roleMember in this)
				{
					MySqlCommand cmd = roleMember.GetSaveCommand(conn);
					roleMember.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM RoleMembers WHERE ID=0");
            foreach (RoleMember roleMember in this)
            {
                DataRow row = dt.NewRow();
				if (!roleMember.IsChurchIdNull) row["ChurchId"] = roleMember.ChurchId;
				if (!roleMember.IsRoleIdNull) row["RoleId"] = roleMember.RoleId;
				if (!roleMember.IsPersonIdNull) row["PersonId"] = roleMember.PersonId;
				if (!roleMember.IsDateAddedNull) row["DateAdded"] = roleMember.DateAdded;
				if (!roleMember.IsAddedByNull) row["AddedBy"] = roleMember.AddedBy;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (RoleMember roleMember in this) result.Add(roleMember.Id);
			return result.ToArray();
		}

		public RoleMember GetById(int id)
		{
			foreach (RoleMember roleMember in this) if (roleMember.Id == id) return roleMember;
			return null;
		}

		public RoleMembers GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			RoleMembers result = new RoleMembers();
			foreach (RoleMember roleMember in this) if (idList.Contains(roleMember.Id)) result.Add(roleMember);
			return result;
		}

		public RoleMembers GetAllByPersonId(System.Int32 personId)
		{
			RoleMembers result = new RoleMembers();
			foreach (RoleMember roleMember in this) if (roleMember.PersonId == personId) result.Add(roleMember);
			return result;
		}

		public RoleMembers GetAllByRoleId(System.Int32 roleId)
		{
			RoleMembers result = new RoleMembers();
			foreach (RoleMember roleMember in this) if (roleMember.RoleId == roleId) result.Add(roleMember);
			return result;
		}

		public RoleMembers Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			RoleMembers result = new RoleMembers();
			foreach (var i in sortedList) { result.Add((RoleMember)i); }
			return result;
		}

		#endregion
	}
}
