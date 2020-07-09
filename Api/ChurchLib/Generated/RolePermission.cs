 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class RolePermission
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.Int32 _roleId;
		System.String _contentType;
		System.Int32 _contentId;
		System.String _action;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isRoleIdNull = true;
		bool _isContentTypeNull = true;
		bool _isContentIdNull = true;
		bool _isActionNull = true;
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
		public System.Int32 RoleId
		{
			get{ return _roleId; }
			set{ _roleId=value; _isRoleIdNull=false; }
		}
		public System.String ContentType
		{
			get{ return _contentType; }
			set{ _contentType=value; _isContentTypeNull=false; }
		}
		public System.Int32 ContentId
		{
			get{ return _contentId; }
			set{ _contentId=value; _isContentIdNull=false; }
		}
		public System.String Action
		{
			get{ return _action; }
			set{ _action=value; _isActionNull=false; }
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
		public bool IsRoleIdNull
		{
			get { return _isRoleIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isRoleIdNull = true;
				_roleId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsContentTypeNull
		{
			get { return _isContentTypeNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isContentTypeNull = true;
				_contentType = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsContentIdNull
		{
			get { return _isContentIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isContentIdNull = true;
				_contentId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsActionNull
		{
			get { return _isActionNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isActionNull = true;
				_action = System.String.Empty;
			}
		}
		#endregion

		#region Constructors
		public RolePermission()
		{
		}

		public RolePermission(DataRow row)
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
			if (row.Table.Columns.Contains("RoleId"))
			{
				if (Convert.IsDBNull(row["RoleId"])) IsRoleIdNull = true;
				else RoleId = Convert.ToInt32(row["RoleId"]);
			}
			if (row.Table.Columns.Contains("ContentType"))
			{
				if (Convert.IsDBNull(row["ContentType"])) IsContentTypeNull = true;
				else ContentType = Convert.ToString(row["ContentType"]);
			}
			if (row.Table.Columns.Contains("ContentId"))
			{
				if (Convert.IsDBNull(row["ContentId"])) IsContentIdNull = true;
				else ContentId = Convert.ToInt32(row["ContentId"]);
			}
			if (row.Table.Columns.Contains("Action"))
			{
				if (Convert.IsDBNull(row["Action"])) IsActionNull = true;
				else Action = Convert.ToString(row["Action"]);
			}
		}
		#endregion

		#region Methods
		public static RolePermission Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			RolePermissions rolePermissions = RolePermissions.Load(sql, commandType, parameters);
			return (rolePermissions.Count == 0) ? null : rolePermissions[0];
		}

		public static RolePermission Load(int id, int churchId)
		{
			return Load("SELECT * FROM RolePermissions WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO RolePermissions (ChurchId, RoleId, ContentType, ContentId, Action) VALUES (@ChurchId, @RoleId, @ContentType, @ContentId, @Action); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@RoleId", (_isRoleIdNull) ? System.DBNull.Value : (object)_roleId);
			cmd.Parameters.AddWithValue("@ContentType", (_isContentTypeNull) ? System.DBNull.Value : (object)_contentType);
			cmd.Parameters.AddWithValue("@ContentId", (_isContentIdNull) ? System.DBNull.Value : (object)_contentId);
			cmd.Parameters.AddWithValue("@Action", (_isActionNull) ? System.DBNull.Value : (object)_action);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE RolePermissions SET ChurchId=@ChurchId, RoleId=@RoleId, ContentType=@ContentType, ContentId=@ContentId, Action=@Action WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@RoleId", (_isRoleIdNull) ? System.DBNull.Value : (object)_roleId);
			cmd.Parameters.AddWithValue("@ContentType", (_isContentTypeNull) ? System.DBNull.Value : (object)_contentType);
			cmd.Parameters.AddWithValue("@ContentId", (_isContentIdNull) ? System.DBNull.Value : (object)_contentId);
			cmd.Parameters.AddWithValue("@Action", (_isActionNull) ? System.DBNull.Value : (object)_action);
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
			DbHelper.ExecuteNonQuery("DELETE FROM RolePermissions WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(RolePermission).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
