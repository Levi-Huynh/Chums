 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace MasterLib{
	[Serializable]
	public partial class User
	{
		#region Declarations
		System.Int32 _id;
		System.String _email;
		System.String _password;
		System.String _name;
		System.DateTime _dateRegistered;
		System.DateTime _lastLogin;
		System.String _resetGuid;

		bool _isIdNull = true;
		bool _isEmailNull = true;
		bool _isPasswordNull = true;
		bool _isNameNull = true;
		bool _isDateRegisteredNull = true;
		bool _isLastLoginNull = true;
		bool _isResetGuidNull = true;
		#endregion

		#region Properties
		public System.Int32 Id
		{
			get{ return _id; }
			set{ _id=value; _isIdNull=false; }
		}
		public System.String Email
		{
			get{ return _email; }
			set{ _email=value; _isEmailNull=false; }
		}
		public System.String Password
		{
			get{ return _password; }
			set{ _password=value; _isPasswordNull=false; }
		}
		public System.String Name
		{
			get{ return _name; }
			set{ _name=value; _isNameNull=false; }
		}
		public System.DateTime DateRegistered
		{
			get{ return _dateRegistered; }
			set{ _dateRegistered=value; _isDateRegisteredNull=false; }
		}
		public System.DateTime LastLogin
		{
			get{ return _lastLogin; }
			set{ _lastLogin=value; _isLastLoginNull=false; }
		}
		public System.String ResetGuid
		{
			get{ return _resetGuid; }
			set{ _resetGuid=value; _isResetGuidNull=false; }
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
		public bool IsEmailNull
		{
			get { return _isEmailNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isEmailNull = true;
				_email = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsPasswordNull
		{
			get { return _isPasswordNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isPasswordNull = true;
				_password = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsNameNull
		{
			get { return _isNameNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isNameNull = true;
				_name = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsDateRegisteredNull
		{
			get { return _isDateRegisteredNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isDateRegisteredNull = true;
				_dateRegistered = DateTime.MinValue;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsLastLoginNull
		{
			get { return _isLastLoginNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isLastLoginNull = true;
				_lastLogin = DateTime.MinValue;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsResetGuidNull
		{
			get { return _isResetGuidNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isResetGuidNull = true;
				_resetGuid = System.String.Empty;
			}
		}
		#endregion

		#region Constructors
		public User()
		{
		}

		public User(DataRow row)
		{
			if (row.Table.Columns.Contains("Id"))
			{
				if (Convert.IsDBNull(row["Id"])) IsIdNull = true;
				else Id = Convert.ToInt32(row["Id"]);
			}
			if (row.Table.Columns.Contains("Email"))
			{
				if (Convert.IsDBNull(row["Email"])) IsEmailNull = true;
				else Email = Convert.ToString(row["Email"]);
			}
			if (row.Table.Columns.Contains("Password"))
			{
				if (Convert.IsDBNull(row["Password"])) IsPasswordNull = true;
				else Password = Convert.ToString(row["Password"]);
			}
			if (row.Table.Columns.Contains("Name"))
			{
				if (Convert.IsDBNull(row["Name"])) IsNameNull = true;
				else Name = Convert.ToString(row["Name"]);
			}
			if (row.Table.Columns.Contains("DateRegistered"))
			{
				if (Convert.IsDBNull(row["DateRegistered"])) IsDateRegisteredNull = true;
				else DateRegistered = Convert.ToDateTime(row["DateRegistered"]);
			}
			if (row.Table.Columns.Contains("LastLogin"))
			{
				if (Convert.IsDBNull(row["LastLogin"])) IsLastLoginNull = true;
				else LastLogin = Convert.ToDateTime(row["LastLogin"]);
			}
			if (row.Table.Columns.Contains("ResetGuid"))
			{
				if (Convert.IsDBNull(row["ResetGuid"])) IsResetGuidNull = true;
				else ResetGuid = Convert.ToString(row["ResetGuid"]);
			}
		}
		#endregion

		#region Methods
		public static User Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			Users users = Users.Load(sql, commandType, parameters);
			return (users.Count == 0) ? null : users[0];
		}

		public static User Load(int id)
		{
			return Load("SELECT * FROM Users WHERE Id=@Idd", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO Users (Email, Password, Name, DateRegistered, LastLogin, ResetGuid) VALUES (@Email, @Password, @Name, @DateRegistered, @LastLogin, @ResetGuid); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@Email", (_isEmailNull) ? System.DBNull.Value : (object)_email);
			cmd.Parameters.AddWithValue("@Password", (_isPasswordNull) ? System.DBNull.Value : (object)_password);
			cmd.Parameters.AddWithValue("@Name", (_isNameNull) ? System.DBNull.Value : (object)_name);
			cmd.Parameters.AddWithValue("@DateRegistered", (_isDateRegisteredNull) ? System.DBNull.Value : (object)_dateRegistered);
			cmd.Parameters.AddWithValue("@LastLogin", (_isLastLoginNull) ? System.DBNull.Value : (object)_lastLogin);
			cmd.Parameters.AddWithValue("@ResetGuid", (_isResetGuidNull) ? System.DBNull.Value : (object)_resetGuid);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE Users SET Email=@Email, Password=@Password, Name=@Name, DateRegistered=@DateRegistered, LastLogin=@LastLogin, ResetGuid=@ResetGuid WHERE Id=@Id; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@Email", (_isEmailNull) ? System.DBNull.Value : (object)_email);
			cmd.Parameters.AddWithValue("@Password", (_isPasswordNull) ? System.DBNull.Value : (object)_password);
			cmd.Parameters.AddWithValue("@Name", (_isNameNull) ? System.DBNull.Value : (object)_name);
			cmd.Parameters.AddWithValue("@DateRegistered", (_isDateRegisteredNull) ? System.DBNull.Value : (object)_dateRegistered);
			cmd.Parameters.AddWithValue("@LastLogin", (_isLastLoginNull) ? System.DBNull.Value : (object)_lastLogin);
			cmd.Parameters.AddWithValue("@ResetGuid", (_isResetGuidNull) ? System.DBNull.Value : (object)_resetGuid);
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
			DbHelper.ExecuteNonQuery("DELETE FROM Users WHERE Id=@Id", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(User).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
