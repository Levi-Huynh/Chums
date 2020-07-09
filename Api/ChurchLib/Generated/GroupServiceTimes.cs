 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class GroupServiceTimes : List<GroupServiceTime>
	{

		#region Constructors
		public GroupServiceTimes() { }
		
		public GroupServiceTimes(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new GroupServiceTime(row));
		}
		#endregion

		#region Methods
		public static GroupServiceTimes Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new GroupServiceTimes(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static GroupServiceTimes Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new GroupServiceTimes();
			else return Load("SELECT * FROM GroupServiceTimes WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static GroupServiceTimes LoadAll()
		{
			return Load("SELECT * FROM GroupServiceTimes", CommandType.Text, null);
		}

		public static GroupServiceTimes LoadByGroupId(System.Int32 groupId, int churchId)
		{
			string sql="SELECT * FROM GroupServiceTimes WHERE ChurchId=@ChurchId AND GroupId=@GroupId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@GroupId", groupId), new MySqlParameter("@ChurchId", churchId) });
		}

		public static GroupServiceTimes LoadByServiceTimeId(System.Int32 serviceTimeId, int churchId)
		{
			string sql="SELECT * FROM GroupServiceTimes WHERE ChurchId=@ChurchId AND ServiceTimeId=@ServiceTimeId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ServiceTimeId", serviceTimeId), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (GroupServiceTime groupServiceTime in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { groupServiceTime.Save(); }
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
				foreach (GroupServiceTime groupServiceTime in this)
				{
					MySqlCommand cmd = groupServiceTime.GetSaveCommand(conn);
					groupServiceTime.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM GroupServiceTimes WHERE ID=0");
            foreach (GroupServiceTime groupServiceTime in this)
            {
                DataRow row = dt.NewRow();
				if (!groupServiceTime.IsChurchIdNull) row["ChurchId"] = groupServiceTime.ChurchId;
				if (!groupServiceTime.IsGroupIdNull) row["GroupId"] = groupServiceTime.GroupId;
				if (!groupServiceTime.IsServiceTimeIdNull) row["ServiceTimeId"] = groupServiceTime.ServiceTimeId;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (GroupServiceTime groupServiceTime in this) result.Add(groupServiceTime.Id);
			return result.ToArray();
		}

		public GroupServiceTime GetById(int id)
		{
			foreach (GroupServiceTime groupServiceTime in this) if (groupServiceTime.Id == id) return groupServiceTime;
			return null;
		}

		public GroupServiceTimes GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			GroupServiceTimes result = new GroupServiceTimes();
			foreach (GroupServiceTime groupServiceTime in this) if (idList.Contains(groupServiceTime.Id)) result.Add(groupServiceTime);
			return result;
		}

		public GroupServiceTimes GetAllByGroupId(System.Int32 groupId)
		{
			GroupServiceTimes result = new GroupServiceTimes();
			foreach (GroupServiceTime groupServiceTime in this) if (groupServiceTime.GroupId == groupId) result.Add(groupServiceTime);
			return result;
		}

		public GroupServiceTimes GetAllByServiceTimeId(System.Int32 serviceTimeId)
		{
			GroupServiceTimes result = new GroupServiceTimes();
			foreach (GroupServiceTime groupServiceTime in this) if (groupServiceTime.ServiceTimeId == serviceTimeId) result.Add(groupServiceTime);
			return result;
		}

		public GroupServiceTimes Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			GroupServiceTimes result = new GroupServiceTimes();
			foreach (var i in sortedList) { result.Add((GroupServiceTime)i); }
			return result;
		}

		#endregion
	}
}
