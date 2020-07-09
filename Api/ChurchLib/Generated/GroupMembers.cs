 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class GroupMembers : List<GroupMember>
	{

		#region Constructors
		public GroupMembers() { }
		
		public GroupMembers(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new GroupMember(row));
		}
		#endregion

		#region Methods
		public static GroupMembers Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new GroupMembers(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static GroupMembers Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new GroupMembers();
			else return Load("SELECT * FROM GroupMembers WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static GroupMembers LoadAll()
		{
			return Load("SELECT * FROM GroupMembers", CommandType.Text, null);
		}

		public static GroupMembers LoadByGroupId(System.Int32 groupId, int churchId)
		{
			string sql="SELECT * FROM GroupMembers WHERE ChurchId=@ChurchId AND GroupId=@GroupId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@GroupId", groupId), new MySqlParameter("@ChurchId", churchId) });
		}

		public static GroupMembers LoadByPersonId(System.Int32 personId, int churchId)
		{
			string sql="SELECT * FROM GroupMembers WHERE ChurchId=@ChurchId AND PersonId=@PersonId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@PersonId", personId), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (GroupMember groupMember in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { groupMember.Save(); }
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
				foreach (GroupMember groupMember in this)
				{
					MySqlCommand cmd = groupMember.GetSaveCommand(conn);
					groupMember.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM GroupMembers WHERE ID=0");
            foreach (GroupMember groupMember in this)
            {
                DataRow row = dt.NewRow();
				if (!groupMember.IsChurchIdNull) row["ChurchId"] = groupMember.ChurchId;
				if (!groupMember.IsGroupIdNull) row["GroupId"] = groupMember.GroupId;
				if (!groupMember.IsPersonIdNull) row["PersonId"] = groupMember.PersonId;
				if (!groupMember.IsJoinDateNull) row["JoinDate"] = groupMember.JoinDate;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (GroupMember groupMember in this) result.Add(groupMember.Id);
			return result.ToArray();
		}

		public GroupMember GetById(int id)
		{
			foreach (GroupMember groupMember in this) if (groupMember.Id == id) return groupMember;
			return null;
		}

		public GroupMembers GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			GroupMembers result = new GroupMembers();
			foreach (GroupMember groupMember in this) if (idList.Contains(groupMember.Id)) result.Add(groupMember);
			return result;
		}

		public GroupMembers GetAllByGroupId(System.Int32 groupId)
		{
			GroupMembers result = new GroupMembers();
			foreach (GroupMember groupMember in this) if (groupMember.GroupId == groupId) result.Add(groupMember);
			return result;
		}

		public GroupMembers GetAllByPersonId(System.Int32 personId)
		{
			GroupMembers result = new GroupMembers();
			foreach (GroupMember groupMember in this) if (groupMember.PersonId == personId) result.Add(groupMember);
			return result;
		}

		public GroupMembers Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			GroupMembers result = new GroupMembers();
			foreach (var i in sortedList) { result.Add((GroupMember)i); }
			return result;
		}

		#endregion
	}
}
