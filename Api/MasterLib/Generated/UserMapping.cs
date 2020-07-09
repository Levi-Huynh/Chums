 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace MasterLib{
	[Serializable]
	public partial class UserMapping
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _userId;
		System.Int32 _churchId;
		System.Int32 _personId;

		bool _isIdNull = true;
		bool _isUserIdNull = true;
		bool _isChurchIdNull = true;
		bool _isPersonIdNull = true;
		#endregion

		#region Properties
		public System.Int32 Id
		{
			get{ return _id; }
			set{ _id=value; _isIdNull=false; }
		}
		public System.Int32 UserId
		{
			get{ return _userId; }
			set{ _userId=value; _isUserIdNull=false; }
		}
		public System.Int32 ChurchId
		{
			get{ return _churchId; }
			set{ _churchId=value; _isChurchIdNull=false; }
		}
		public System.Int32 PersonId
		{
			get{ return _personId; }
			set{ _personId=value; _isPersonIdNull=false; }
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
		public bool IsUserIdNull
		{
			get { return _isUserIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isUserIdNull = true;
				_userId = 0;
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
		public bool IsPersonIdNull
		{
			get { return _isPersonIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isPersonIdNull = true;
				_personId = 0;
			}
		}
		#endregion

		#region Constructors
		public UserMapping()
		{
		}

		public UserMapping(DataRow row)
		{
			if (row.Table.Columns.Contains("Id"))
			{
				if (Convert.IsDBNull(row["Id"])) IsIdNull = true;
				else Id = Convert.ToInt32(row["Id"]);
			}
			if (row.Table.Columns.Contains("UserId"))
			{
				if (Convert.IsDBNull(row["UserId"])) IsUserIdNull = true;
				else UserId = Convert.ToInt32(row["UserId"]);
			}
			if (row.Table.Columns.Contains("ChurchId"))
			{
				if (Convert.IsDBNull(row["ChurchId"])) IsChurchIdNull = true;
				else ChurchId = Convert.ToInt32(row["ChurchId"]);
			}
			if (row.Table.Columns.Contains("PersonId"))
			{
				if (Convert.IsDBNull(row["PersonId"])) IsPersonIdNull = true;
				else PersonId = Convert.ToInt32(row["PersonId"]);
			}
		}
		#endregion

		#region Methods
		public static UserMapping Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			UserMappings userMappings = UserMappings.Load(sql, commandType, parameters);
			return (userMappings.Count == 0) ? null : userMappings[0];
		}

		public static UserMapping Load(int id)
		{
			return Load("SELECT * FROM UserMappings WHERE Id=@Idd", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO UserMappings (UserId, ChurchId, PersonId) VALUES (@UserId, @ChurchId, @PersonId); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@UserId", (_isUserIdNull) ? System.DBNull.Value : (object)_userId);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@PersonId", (_isPersonIdNull) ? System.DBNull.Value : (object)_personId);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE UserMappings SET UserId=@UserId, ChurchId=@ChurchId, PersonId=@PersonId WHERE Id=@Id; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@UserId", (_isUserIdNull) ? System.DBNull.Value : (object)_userId);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@PersonId", (_isPersonIdNull) ? System.DBNull.Value : (object)_personId);
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

		public static void Delete(int id)
		{
			DbHelper.ExecuteNonQuery("DELETE FROM UserMappings WHERE Id=@Id", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(UserMapping).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
