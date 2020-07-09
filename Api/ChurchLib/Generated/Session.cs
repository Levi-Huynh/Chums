 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class Session
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.Int32 _groupId;
		System.Int32 _serviceTimeId;
		System.DateTime _sessionDate;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isGroupIdNull = true;
		bool _isServiceTimeIdNull = true;
		bool _isSessionDateNull = true;
		#endregion

		#region Properties
		public System.Int32 Id
		{
			get{ return _id; }
			set{ _id=value; _isIdNull=false; }
		}
		public System.Int32 ChurchId
		{
			get{ return _churchId; }
			set{ _churchId=value; _isChurchIdNull=false; }
		}
		public System.Int32 GroupId
		{
			get{ return _groupId; }
			set{ _groupId=value; _isGroupIdNull=false; }
		}
		public System.Int32 ServiceTimeId
		{
			get{ return _serviceTimeId; }
			set{ _serviceTimeId=value; _isServiceTimeIdNull=false; }
		}
		public System.DateTime SessionDate
		{
			get{ return _sessionDate; }
			set{ _sessionDate=value; _isSessionDateNull=false; }
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
		public bool IsGroupIdNull
		{
			get { return _isGroupIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isGroupIdNull = true;
				_groupId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsServiceTimeIdNull
		{
			get { return _isServiceTimeIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isServiceTimeIdNull = true;
				_serviceTimeId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsSessionDateNull
		{
			get { return _isSessionDateNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isSessionDateNull = true;
				_sessionDate = DateTime.MinValue;
			}
		}
		#endregion

		#region Constructors
		public Session()
		{
		}

		public Session(DataRow row)
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
			if (row.Table.Columns.Contains("GroupId"))
			{
				if (Convert.IsDBNull(row["GroupId"])) IsGroupIdNull = true;
				else GroupId = Convert.ToInt32(row["GroupId"]);
			}
			if (row.Table.Columns.Contains("ServiceTimeId"))
			{
				if (Convert.IsDBNull(row["ServiceTimeId"])) IsServiceTimeIdNull = true;
				else ServiceTimeId = Convert.ToInt32(row["ServiceTimeId"]);
			}
			if (row.Table.Columns.Contains("SessionDate"))
			{
				if (Convert.IsDBNull(row["SessionDate"])) IsSessionDateNull = true;
				else SessionDate = Convert.ToDateTime(row["SessionDate"]);
			}
		}
		#endregion

		#region Methods
		public static Session Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			Sessions sessions = Sessions.Load(sql, commandType, parameters);
			return (sessions.Count == 0) ? null : sessions[0];
		}

		public static Session Load(int id, int churchId)
		{
			return Load("SELECT * FROM Sessions WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO Sessions (ChurchId, GroupId, ServiceTimeId, SessionDate) VALUES (@ChurchId, @GroupId, @ServiceTimeId, @SessionDate); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@GroupId", (_isGroupIdNull) ? System.DBNull.Value : (object)_groupId);
			cmd.Parameters.AddWithValue("@ServiceTimeId", (_isServiceTimeIdNull) ? System.DBNull.Value : (object)_serviceTimeId);
			cmd.Parameters.AddWithValue("@SessionDate", (_isSessionDateNull) ? System.DBNull.Value : (object)_sessionDate);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE Sessions SET ChurchId=@ChurchId, GroupId=@GroupId, ServiceTimeId=@ServiceTimeId, SessionDate=@SessionDate WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@GroupId", (_isGroupIdNull) ? System.DBNull.Value : (object)_groupId);
			cmd.Parameters.AddWithValue("@ServiceTimeId", (_isServiceTimeIdNull) ? System.DBNull.Value : (object)_serviceTimeId);
			cmd.Parameters.AddWithValue("@SessionDate", (_isSessionDateNull) ? System.DBNull.Value : (object)_sessionDate);
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
			DbHelper.ExecuteNonQuery("DELETE FROM Sessions WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(Session).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
