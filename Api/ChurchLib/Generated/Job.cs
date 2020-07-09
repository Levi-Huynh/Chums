

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib
{
	[Serializable]
	public partial class Job
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.String _jobType;
		System.DateTime _startTime;
		System.DateTime _endTime;
		System.String _associatedFile;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isJobTypeNull = true;
		bool _isStartTimeNull = true;
		bool _isEndTimeNull = true;
		bool _isAssociatedFileNull = true;
		#endregion

		#region Properties
		public System.Int32 Id
		{
			get { return _id; }
			set { _id = value; _isIdNull = false; }
		}
		public System.Int32 ChurchId
		{
			get { return _churchId; }
			set { _churchId = value; _isChurchIdNull = false; }
		}
		public System.String JobType
		{
			get { return _jobType; }
			set { _jobType = value; _isJobTypeNull = false; }
		}
		public System.DateTime StartTime
		{
			get { return _startTime; }
			set { _startTime = value; _isStartTimeNull = false; }
		}
		public System.DateTime EndTime
		{
			get { return _endTime; }
			set { _endTime = value; _isEndTimeNull = false; }
		}
		public System.String AssociatedFile
		{
			get { return _associatedFile; }
			set { _associatedFile = value; _isAssociatedFileNull = false; }
		}
		[XmlIgnoreAttribute]
		public bool IsIdNull
		{
			get { return _isIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isIdNull = true;
				_id = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsChurchIdNull
		{
			get { return _isChurchIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isChurchIdNull = true;
				_churchId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsJobTypeNull
		{
			get { return _isJobTypeNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isJobTypeNull = true;
				_jobType = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsStartTimeNull
		{
			get { return _isStartTimeNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isStartTimeNull = true;
				_startTime = DateTime.MinValue;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsEndTimeNull
		{
			get { return _isEndTimeNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isEndTimeNull = true;
				_endTime = DateTime.MinValue;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsAssociatedFileNull
		{
			get { return _isAssociatedFileNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isAssociatedFileNull = true;
				_associatedFile = System.String.Empty;
			}
		}
		#endregion

		#region Constructors
		public Job()
		{
		}

		public Job(DataRow row)
		{
			if (row.Table.Columns.Contains("Id"))
			{
				if (Convert.IsDBNull(row["Id"])) IsIdNull = true;
				else Id = Convert.ToInt32(row["Id"]);
			}
			if (row.Table.Columns.Contains("ChurchId"))
			{
				if (Convert.IsDBNull(row["ChurchId"])) IsChurchIdNull = true;
				else ChurchId = Convert.ToInt32(row["ChurchId"]);
			}
			if (row.Table.Columns.Contains("JobType"))
			{
				if (Convert.IsDBNull(row["JobType"])) IsJobTypeNull = true;
				else JobType = Convert.ToString(row["JobType"]);
			}
			if (row.Table.Columns.Contains("StartTime"))
			{
				if (Convert.IsDBNull(row["StartTime"])) IsStartTimeNull = true;
				else StartTime = Convert.ToDateTime(row["StartTime"]);
			}
			if (row.Table.Columns.Contains("EndTime"))
			{
				if (Convert.IsDBNull(row["EndTime"])) IsEndTimeNull = true;
				else EndTime = Convert.ToDateTime(row["EndTime"]);
			}
			if (row.Table.Columns.Contains("AssociatedFile"))
			{
				if (Convert.IsDBNull(row["AssociatedFile"])) IsAssociatedFileNull = true;
				else AssociatedFile = Convert.ToString(row["AssociatedFile"]);
			}
		}
		#endregion

		#region Methods
		public static Job Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			Jobs jobs = Jobs.Load(sql, commandType, parameters);
			return (jobs.Count == 0) ? null : jobs[0];
		}

		public static Job Load(int id, int churchId)
		{
			return Load("SELECT * FROM Jobs WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id == 0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO Jobs (ChurchId, JobType, StartTime, EndTime, AssociatedFile) VALUES (@ChurchId, @JobType, @StartTime, @EndTime, @AssociatedFile); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) { CommandType = CommandType.Text };
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@JobType", (_isJobTypeNull) ? System.DBNull.Value : (object)_jobType);
			cmd.Parameters.AddWithValue("@StartTime", (_isStartTimeNull) ? System.DBNull.Value : (object)_startTime);
			cmd.Parameters.AddWithValue("@EndTime", (_isEndTimeNull) ? System.DBNull.Value : (object)_endTime);
			cmd.Parameters.AddWithValue("@AssociatedFile", (_isAssociatedFileNull) ? System.DBNull.Value : (object)_associatedFile);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE Jobs SET ChurchId=@ChurchId, JobType=@JobType, StartTime=@StartTime, EndTime=@EndTime, AssociatedFile=@AssociatedFile WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) { CommandType = CommandType.Text };
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@JobType", (_isJobTypeNull) ? System.DBNull.Value : (object)_jobType);
			cmd.Parameters.AddWithValue("@StartTime", (_isStartTimeNull) ? System.DBNull.Value : (object)_startTime);
			cmd.Parameters.AddWithValue("@EndTime", (_isEndTimeNull) ? System.DBNull.Value : (object)_endTime);
			cmd.Parameters.AddWithValue("@AssociatedFile", (_isAssociatedFileNull) ? System.DBNull.Value : (object)_associatedFile);
			return cmd;
		}

		public int Save()
		{
			MySqlCommand cmd = GetSaveCommand(DbHelper.Connection);
			cmd.Connection.Open();
			try
			{
				DbHelper.SetContextInfo(cmd.Connection);
				Id = Convert.ToInt32(cmd.ExecuteScalar());
			}
			catch (Exception ex) { throw ex; }
			finally { cmd.Connection.Close(); }
			return Id;
		}

		public static void Delete(int id, int churchId)
		{
			DbHelper.ExecuteNonQuery("DELETE FROM Jobs WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(Job).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
