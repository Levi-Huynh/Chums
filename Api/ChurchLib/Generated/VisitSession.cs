 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class VisitSession
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.Int32 _visitId;
		System.Int32 _sessionId;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isVisitIdNull = true;
		bool _isSessionIdNull = true;
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
		public System.Int32 VisitId
		{
			get{ return _visitId; }
			set{ _visitId=value; _isVisitIdNull=false; }
		}
		public System.Int32 SessionId
		{
			get{ return _sessionId; }
			set{ _sessionId=value; _isSessionIdNull=false; }
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
		public bool IsVisitIdNull
		{
			get { return _isVisitIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isVisitIdNull = true;
				_visitId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsSessionIdNull
		{
			get { return _isSessionIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isSessionIdNull = true;
				_sessionId = 0;
			}
		}
		#endregion

		#region Constructors
		public VisitSession()
		{
		}

		public VisitSession(DataRow row)
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
			if (row.Table.Columns.Contains("VisitId"))
			{
				if (Convert.IsDBNull(row["VisitId"])) IsVisitIdNull = true;
				else VisitId = Convert.ToInt32(row["VisitId"]);
			}
			if (row.Table.Columns.Contains("SessionId"))
			{
				if (Convert.IsDBNull(row["SessionId"])) IsSessionIdNull = true;
				else SessionId = Convert.ToInt32(row["SessionId"]);
			}
		}
		#endregion

		#region Methods
		public static VisitSession Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			VisitSessions visitSessions = VisitSessions.Load(sql, commandType, parameters);
			return (visitSessions.Count == 0) ? null : visitSessions[0];
		}

		public static VisitSession Load(int id, int churchId)
		{
			return Load("SELECT * FROM VisitSessions WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO VisitSessions (ChurchId, VisitId, SessionId) VALUES (@ChurchId, @VisitId, @SessionId); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@VisitId", (_isVisitIdNull) ? System.DBNull.Value : (object)_visitId);
			cmd.Parameters.AddWithValue("@SessionId", (_isSessionIdNull) ? System.DBNull.Value : (object)_sessionId);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE VisitSessions SET ChurchId=@ChurchId, VisitId=@VisitId, SessionId=@SessionId WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@VisitId", (_isVisitIdNull) ? System.DBNull.Value : (object)_visitId);
			cmd.Parameters.AddWithValue("@SessionId", (_isSessionIdNull) ? System.DBNull.Value : (object)_sessionId);
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
			DbHelper.ExecuteNonQuery("DELETE FROM VisitSessions WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(VisitSession).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
