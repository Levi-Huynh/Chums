 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class RolePermissions : List<RolePermission>
	{

		#region Constructors
		public RolePermissions() { }
		
		public RolePermissions(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new RolePermission(row));
		}
		#endregion

		#region Methods
		public static RolePermissions Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new RolePermissions(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static RolePermissions Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new RolePermissions();
			else return Load("SELECT * FROM RolePermissions WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static RolePermissions LoadAll()
		{
			return Load("SELECT * FROM RolePermissions", CommandType.Text, null);
		}

		public static RolePermissions LoadByRoleId(System.Int32 roleId, int churchId)
		{
			string sql="SELECT * FROM RolePermissions WHERE ChurchId=@ChurchId AND RoleId=@RoleId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@RoleId", roleId), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (RolePermission rolePermission in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { rolePermission.Save(); }
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
				foreach (RolePermission rolePermission in this)
				{
					MySqlCommand cmd = rolePermission.GetSaveCommand(conn);
					rolePermission.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM RolePermissions WHERE ID=0");
            foreach (RolePermission rolePermission in this)
            {
                DataRow row = dt.NewRow();
				if (!rolePermission.IsChurchIdNull) row["ChurchId"] = rolePermission.ChurchId;
				if (!rolePermission.IsRoleIdNull) row["RoleId"] = rolePermission.RoleId;
				if (!rolePermission.IsContentTypeNull) row["ContentType"] = rolePermission.ContentType;
				if (!rolePermission.IsContentIdNull) row["ContentId"] = rolePermission.ContentId;
				if (!rolePermission.IsActionNull) row["Action"] = rolePermission.Action;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (RolePermission rolePermission in this) result.Add(rolePermission.Id);
			return result.ToArray();
		}

		public RolePermission GetById(int id)
		{
			foreach (RolePermission rolePermission in this) if (rolePermission.Id == id) return rolePermission;
			return null;
		}

		public RolePermissions GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			RolePermissions result = new RolePermissions();
			foreach (RolePermission rolePermission in this) if (idList.Contains(rolePermission.Id)) result.Add(rolePermission);
			return result;
		}

		public RolePermissions GetAllByRoleId(System.Int32 roleId)
		{
			RolePermissions result = new RolePermissions();
			foreach (RolePermission rolePermission in this) if (rolePermission.RoleId == roleId) result.Add(rolePermission);
			return result;
		}

		public RolePermissions Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			RolePermissions result = new RolePermissions();
			foreach (var i in sortedList) { result.Add((RolePermission)i); }
			return result;
		}

		#endregion
	}
}
